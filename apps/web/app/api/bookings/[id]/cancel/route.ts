import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";
import { sendCancellationEmail } from "@/app/lib/email";

const CANCELLATION_WINDOW_HOURS = 24;

/**
 * POST /api/bookings/[id]/cancel
 *
 * Client can cancel a CONFIRMED booking if the session is > 24 hours away.
 * Frees the slot back to AVAILABLE.
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
        const body = await req.json().catch(() => ({}));
        const reason = (body as { reason?: string }).reason || "Client requested cancellation";

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                slot: true,
                client: true,
                expert: { include: { user: { select: { name: true, email: true } } } },
            },
        });

        if (!booking) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Booking not found" } },
                { status: 404 },
            );
        }

        // Ownership check
        if (booking.clientId !== session.user.id && (session.user.role as string) !== "ADMIN") {
            return NextResponse.json(
                { error: { code: "FORBIDDEN", message: "Not your booking" } },
                { status: 403 },
            );
        }

        // Status check
        if (booking.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: `Cannot cancel a booking with status: ${booking.status}` } },
                { status: 400 },
            );
        }

        // 24-hour cancellation policy
        const hoursUntilSession = (new Date(booking.slot.startAt).getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilSession < CANCELLATION_WINDOW_HOURS && (session.user.role as string) !== "ADMIN") {
            return NextResponse.json(
                { error: { code: "POLICY", message: `Cancellations must be made at least ${CANCELLATION_WINDOW_HOURS} hours before the session. Contact support for assistance.` } },
                { status: 400 },
            );
        }

        // Cancel booking + free slot
        await prisma.$transaction([
            prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date(),
                    cancelReason: reason,
                },
            }),
            prisma.availabilitySlot.update({
                where: { id: booking.slotId },
                data: {
                    status: "AVAILABLE",
                    reservedUntil: null,
                    reservedByBookingId: null,
                },
            }),
        ]);

        logger.bookingCancelled(bookingId, reason);

        // Send cancellation emails
        const dateTime = new Intl.DateTimeFormat("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi", timeZoneName: "short",
        }).format(new Date(booking.slot.startAt));

        await sendCancellationEmail({
            clientEmail: booking.client.email,
            clientName: booking.client.name,
            expertEmail: booking.expert.user.email,
            expertName: booking.expert.user.name,
            dateTime,
            reason,
        }).catch((err) => logger.error("cancel.email.failed", { bookingId, error: String(err) }));

        return NextResponse.json({
            message: "Booking cancelled successfully",
            bookingId,
        });
    } catch (error) {
        logger.error("booking.cancel.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Failed to cancel booking" } },
            { status: 500 },
        );
    }
}
