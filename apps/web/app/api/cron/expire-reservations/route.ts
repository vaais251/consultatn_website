import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";

/**
 * GET /api/cron/expire-reservations?token=CRON_TOKEN
 *
 * Finds RESERVED slots past their reservedUntil and frees them.
 * Sets linked bookings to EXPIRED if still PENDING_PAYMENT.
 * Secured via CRON_TOKEN environment variable.
 *
 * Call from deployment cron every 2-5 minutes.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const cronToken = process.env.CRON_TOKEN;
    if (!cronToken || token !== cronToken) {
        return NextResponse.json(
            { error: { code: "UNAUTHORIZED", message: "Invalid or missing cron token" } },
            { status: 401 },
        );
    }

    try {
        const now = new Date();

        // Find expired reservations
        const expiredSlots = await prisma.availabilitySlot.findMany({
            where: {
                status: "RESERVED",
                reservedUntil: { lt: now },
            },
            select: {
                id: true,
                reservedByBookingId: true,
            },
        });

        if (expiredSlots.length === 0) {
            return NextResponse.json({ expired: 0, message: "No expired reservations" });
        }

        let expiredCount = 0;

        for (const slot of expiredSlots) {
            await prisma.$transaction(async (tx) => {
                // Free the slot
                await tx.availabilitySlot.update({
                    where: { id: slot.id },
                    data: {
                        status: "AVAILABLE",
                        reservedUntil: null,
                        reservedByBookingId: null,
                    },
                });

                // Expire the linked booking if still pending
                if (slot.reservedByBookingId) {
                    const booking = await tx.booking.findUnique({
                        where: { id: slot.reservedByBookingId },
                        select: { id: true, status: true },
                    });

                    if (booking && booking.status === "PENDING_PAYMENT") {
                        await tx.booking.update({
                            where: { id: booking.id },
                            data: { status: "EXPIRED" },
                        });

                        logger.reservationExpired(booking.id, slot.id);
                    }
                }
            });

            expiredCount++;
        }

        logger.info("cron.expire-reservations.completed", { expiredCount });

        return NextResponse.json({
            expired: expiredCount,
            message: `Expired ${expiredCount} reservation(s)`,
        });
    } catch (error) {
        logger.error("cron.expire-reservations.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Failed to expire reservations" } },
            { status: 500 },
        );
    }
}
