import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — Fetch available slots for an expert (public for booking page)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const expertUserId = searchParams.get("expertUserId");

        if (!expertUserId) {
            return NextResponse.json({ error: "expertUserId required" }, { status: 400 });
        }

        const expertProfile = await prisma.expertProfile.findUnique({
            where: { userId: expertUserId },
        });

        if (!expertProfile) {
            return NextResponse.json({ error: "Expert not found" }, { status: 404 });
        }

        const now = new Date();
        const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

        const slots = await prisma.availabilitySlot.findMany({
            where: {
                expertId: expertProfile.id,
                status: "AVAILABLE",
                startAt: { gte: now, lte: twoWeeks },
            },
            orderBy: { startAt: "asc" },
            select: {
                id: true,
                startAt: true,
                endAt: true,
            },
        });

        return NextResponse.json(slots);
    } catch (error) {
        console.error("Slots fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}
