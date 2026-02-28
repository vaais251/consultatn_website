import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";
import { z } from "zod";

const RESERVATION_MINUTES = 20;

const bookingSchema = z.object({
    expertId: z.string().min(1),
    slotId: z.string().min(1),
    nationality: z.string().min(2, "Nationality is required"),
    travelDates: z.string().min(3, "Travel dates are required"),
    interests: z.string().min(5, "Please describe your interests"),
    questions: z.string().min(5, "Please share your questions"),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
        }

        if (!["CLIENT", "ADMIN"].includes(session.user.role as string)) {
            return NextResponse.json({ error: { code: "FORBIDDEN", message: "Only clients can book" } }, { status: 403 });
        }

        const body = await req.json();
        const result = bookingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: { code: "VALIDATION", message: result.error.issues[0].message } }, { status: 400 });
        }

        const { expertId, slotId, nationality, travelDates, interests, questions } = result.data;

        // Verify expert
        const expertProfile = await prisma.expertProfile.findUnique({ where: { userId: expertId } });
        if (!expertProfile) {
            return NextResponse.json({ error: { code: "NOT_FOUND", message: "Expert not found" } }, { status: 404 });
        }

        // Verify slot
        const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot) {
            return NextResponse.json({ error: { code: "NOT_FOUND", message: "Slot not found" } }, { status: 404 });
        }
        if (slot.status !== "AVAILABLE") {
            return NextResponse.json({ error: { code: "SLOT_TAKEN", message: "This slot is no longer available" } }, { status: 409 });
        }
        if (slot.expertId !== expertProfile.id) {
            return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Slot does not belong to this expert" } }, { status: 400 });
        }

        // Create booking with RESERVATION (20 min window)
        const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);

        const booking = await prisma.$transaction(async (tx) => {
            // Double-check slot inside transaction
            const freshSlot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
            if (!freshSlot || freshSlot.status !== "AVAILABLE") {
                throw new Error("SLOT_TAKEN");
            }

            // Create booking first
            const newBooking = await tx.booking.create({
                data: {
                    clientId: session.user!.id!,
                    expertId: expertProfile.id,
                    slotId,
                    status: "PENDING_PAYMENT",
                    preConsultationForm: {
                        create: { nationality, travelDates, interests, questions },
                    },
                },
                include: {
                    slot: true,
                    expert: { include: { user: { select: { name: true } } } },
                    preConsultationForm: true,
                },
            });

            // Reserve the slot (not BOOKED — will become BOOKED on payment)
            await tx.availabilitySlot.update({
                where: { id: slotId },
                data: {
                    status: "RESERVED",
                    reservedUntil,
                    reservedByBookingId: newBooking.id,
                },
            });

            return newBooking;
        });

        logger.bookingCreated(booking.id, session.user.id!, expertProfile.id, slotId);
        logger.reservationCreated(booking.id, slotId, reservedUntil.toISOString());

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "SLOT_TAKEN") {
            return NextResponse.json(
                { error: { code: "SLOT_TAKEN", message: "This slot was just taken by another user. Please choose a different time." } },
                { status: 409 },
            );
        }
        logger.error("booking.creation.failed", { error: String(error) });
        return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to create booking" } }, { status: 500 });
    }
}
