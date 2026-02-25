import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only CLIENT or higher can book
        if (!["CLIENT", "ADMIN"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Only clients can book" }, { status: 403 });
        }

        const body = await req.json();
        const result = bookingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { expertId, slotId, nationality, travelDates, interests, questions } = result.data;

        // Verify the expert profile exists
        const expertProfile = await prisma.expertProfile.findUnique({
            where: { userId: expertId },
        });
        if (!expertProfile) {
            return NextResponse.json({ error: "Expert not found" }, { status: 404 });
        }

        // Verify the slot exists and is available
        const slot = await prisma.availabilitySlot.findUnique({
            where: { id: slotId },
        });
        if (!slot) {
            return NextResponse.json({ error: "Slot not found" }, { status: 404 });
        }
        if (slot.status !== "AVAILABLE") {
            return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 });
        }
        if (slot.expertId !== expertProfile.id) {
            return NextResponse.json({ error: "Slot does not belong to this expert" }, { status: 400 });
        }

        // Create booking + pre-consultation form + mark slot as BOOKED (transaction)
        const booking = await prisma.$transaction(async (tx) => {
            // Double-check slot availability inside transaction
            const freshSlot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
            if (!freshSlot || freshSlot.status !== "AVAILABLE") {
                throw new Error("SLOT_TAKEN");
            }

            // Mark slot as booked
            await tx.availabilitySlot.update({
                where: { id: slotId },
                data: { status: "BOOKED" },
            });

            // Create booking
            const newBooking = await tx.booking.create({
                data: {
                    clientId: session.user!.id!,
                    expertId: expertProfile.id,
                    slotId,
                    status: "PENDING_PAYMENT",
                    preConsultationForm: {
                        create: {
                            nationality,
                            travelDates,
                            interests,
                            questions,
                        },
                    },
                },
                include: {
                    slot: true,
                    expert: { include: { user: { select: { name: true } } } },
                    preConsultationForm: true,
                },
            });

            return newBooking;
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "SLOT_TAKEN") {
            return NextResponse.json(
                { error: "This slot was just taken by another user. Please choose a different time." },
                { status: 409 },
            );
        }
        console.error("Booking creation error:", error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}
