import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";
import { sendRescheduleEmail } from "@/app/lib/email";
import { z } from "zod";

const rescheduleSchema = z.object({
    newSlotId: z.string().min(1, "New slot ID required"),
});

/**
 * POST /api/bookings/[id]/reschedule
 *
 * Client can reschedule a CONFIRMED booking to a new AVAILABLE slot
 * for the same expert. No new payment required if same duration.
 *
 * Creates a new booking, cancels old one, frees old slot, reserves new slot.
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 },
            );
        }

        const { id: bookingId } = await params;
        const body = await req.json();
        const parsed = rescheduleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: { code: "VALIDATION", message: parsed.error.issues[0].message } },
                { status: 400 },
            );
        }

        const { newSlotId } = parsed.data;

        // Fetch old booking
        const oldBooking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                slot: true,
                client: true,
                preConsultationForm: true,
                payment: true,
                expert: { include: { user: { select: { name: true, email: true } } } },
            },
        });

        if (!oldBooking) {
            return NextResponse.json({ error: { code: "NOT_FOUND", message: "Booking not found" } }, { status: 404 });
        }

        // Ownership
        if (oldBooking.clientId !== session.user.id && (session.user.role as string) !== "ADMIN") {
            return NextResponse.json({ error: { code: "FORBIDDEN", message: "Not your booking" } }, { status: 403 });
        }

        // Must be CONFIRMED
        if (oldBooking.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: "Can only reschedule confirmed bookings" } },
                { status: 400 },
            );
        }

        // Verify new slot
        const newSlot = await prisma.availabilitySlot.findUnique({ where: { id: newSlotId } });
        if (!newSlot) {
            return NextResponse.json({ error: { code: "NOT_FOUND", message: "New slot not found" } }, { status: 404 });
        }
        if (newSlot.status !== "AVAILABLE") {
            return NextResponse.json({ error: { code: "SLOT_TAKEN", message: "New slot is not available" } }, { status: 409 });
        }

        // Must be same expert
        if (newSlot.expertId !== oldBooking.slot.expertId) {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: "New slot must be with the same expert" } },
                { status: 400 },
            );
        }

        // TODO: if durations differ, require new payment (proration)

        // Transaction: cancel old booking, create new booking, swap slots
        const newBooking = await prisma.$transaction(async (tx) => {
            // Double-check new slot in transaction
            const freshSlot = await tx.availabilitySlot.findUnique({ where: { id: newSlotId } });
            if (!freshSlot || freshSlot.status !== "AVAILABLE") {
                throw new Error("SLOT_TAKEN");
            }

            // Cancel old booking
            await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date(),
                    cancelReason: "Rescheduled",
                },
            });

            // Free old slot
            await tx.availabilitySlot.update({
                where: { id: oldBooking.slotId },
                data: {
                    status: "AVAILABLE",
                    reservedUntil: null,
                    reservedByBookingId: null,
                },
            });

            // Create new booking (already paid — status CONFIRMED)
            const created = await tx.booking.create({
                data: {
                    clientId: oldBooking.clientId,
                    expertId: oldBooking.expertId,
                    slotId: newSlotId,
                    status: "CONFIRMED",
                    meetingLink: oldBooking.meetingLink,
                    rescheduledFromBookingId: bookingId,
                    preConsultationForm: oldBooking.preConsultationForm
                        ? {
                            create: {
                                nationality: oldBooking.preConsultationForm.nationality,
                                travelDates: oldBooking.preConsultationForm.travelDates,
                                interests: oldBooking.preConsultationForm.interests,
                                questions: oldBooking.preConsultationForm.questions,
                            },
                        }
                        : undefined,
                },
            });

            // Book new slot
            await tx.availabilitySlot.update({
                where: { id: newSlotId },
                data: {
                    status: "BOOKED",
                    reservedByBookingId: created.id,
                },
            });

            return created;
        });

        logger.bookingRescheduled(bookingId, newBooking.id);

        // Send reschedule emails
        const formatDT = (d: Date) => new Intl.DateTimeFormat("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi", timeZoneName: "short",
        }).format(new Date(d));

        await sendRescheduleEmail({
            clientEmail: oldBooking.client.email,
            clientName: oldBooking.client.name,
            expertEmail: oldBooking.expert.user.email,
            expertName: oldBooking.expert.user.name,
            oldDateTime: formatDT(oldBooking.slot.startAt),
            newDateTime: formatDT(newSlot.startAt),
        }).catch((err) => logger.error("reschedule.email.failed", { bookingId, error: String(err) }));

        return NextResponse.json({
            message: "Booking rescheduled successfully",
            oldBookingId: bookingId,
            newBookingId: newBooking.id,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "SLOT_TAKEN") {
            return NextResponse.json(
                { error: { code: "SLOT_TAKEN", message: "New slot was just taken. Please choose another." } },
                { status: 409 },
            );
        }
        logger.error("booking.reschedule.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Failed to reschedule booking" } },
            { status: 500 },
        );
    }
}
