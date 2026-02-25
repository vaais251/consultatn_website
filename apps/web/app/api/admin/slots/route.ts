import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const createSlotSchema = z.object({
    expertProfileId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startHour: z.number().min(0).max(23),
    startMinute: z.number().min(0).max(59),
    durationMinutes: z.number().refine((v) => [30, 60, 90].includes(v), {
        message: "Duration must be 30, 60, or 90 minutes",
    }),
});

// POST — Create availability slot
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const result = createSlotSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { expertProfileId, date, startHour, startMinute, durationMinutes } = result.data;

        // Build startAt and endAt
        const startAt = new Date(`${date}T${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:00Z`);
        const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);

        // Validate: must be in the future
        if (startAt <= new Date()) {
            return NextResponse.json({ error: "Slot must be in the future" }, { status: 400 });
        }

        // Check for overlaps
        const overlap = await prisma.availabilitySlot.findFirst({
            where: {
                expertId: expertProfileId,
                status: { not: "BLOCKED" },
                OR: [
                    { startAt: { gte: startAt, lt: endAt } },
                    { endAt: { gt: startAt, lte: endAt } },
                    { startAt: { lte: startAt }, endAt: { gte: endAt } },
                ],
            },
        });

        if (overlap) {
            return NextResponse.json({ error: "This slot overlaps with an existing one" }, { status: 409 });
        }

        const slot = await prisma.availabilitySlot.create({
            data: { expertId: expertProfileId, startAt, endAt },
        });

        return NextResponse.json(slot, { status: 201 });
    } catch (error) {
        console.error("Slot creation error:", error);
        return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
    }
}

// GET — List slots for an expert
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const expertProfileId = searchParams.get("expertProfileId");
        if (!expertProfileId) {
            return NextResponse.json({ error: "expertProfileId required" }, { status: 400 });
        }

        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const slots = await prisma.availabilitySlot.findMany({
            where: {
                expertId: expertProfileId,
                startAt: { gte: now, lte: thirtyDays },
            },
            orderBy: { startAt: "asc" },
            include: { booking: { select: { id: true, status: true } } },
        });

        return NextResponse.json(slots);
    } catch (error) {
        console.error("Slot fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}

// PATCH — Change slot status (block/unblock)
export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { slotId, status } = body;

        if (!slotId || !["AVAILABLE", "BLOCKED"].includes(status)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });

        if (slot.status === "BOOKED") {
            // TODO: admin override for booked slots
            return NextResponse.json({ error: "Cannot modify a booked slot" }, { status: 400 });
        }

        const updated = await prisma.availabilitySlot.update({
            where: { id: slotId },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Slot update error:", error);
        return NextResponse.json({ error: "Failed to update slot" }, { status: 500 });
    }
}

// DELETE — Remove a slot
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const slotId = searchParams.get("slotId");
        if (!slotId) return NextResponse.json({ error: "slotId required" }, { status: 400 });

        const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });

        if (slot.status === "BOOKED") {
            return NextResponse.json({ error: "Cannot delete a booked slot" }, { status: 400 });
        }

        await prisma.availabilitySlot.delete({ where: { id: slotId } });
        return NextResponse.json({ message: "Slot deleted" });
    } catch (error) {
        console.error("Slot delete error:", error);
        return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
    }
}
