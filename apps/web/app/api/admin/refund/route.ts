import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { stripe } from "@/app/lib/stripe";
import { logger } from "@/app/lib/logger";

/**
 * POST /api/admin/refund
 *
 * Admin-only: issue a full Stripe refund for a booking.
 * Requires: { bookingId: string }
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || (session.user.role as string) !== "ADMIN") {
            return NextResponse.json(
                { error: { code: "FORBIDDEN", message: "Admin access required" } },
                { status: 403 },
            );
        }

        const { bookingId } = await req.json();
        if (!bookingId) {
            return NextResponse.json(
                { error: { code: "VALIDATION", message: "bookingId required" } },
                { status: 400 },
            );
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        });

        if (!booking) {
            return NextResponse.json(
                { error: { code: "NOT_FOUND", message: "Booking not found" } },
                { status: 404 },
            );
        }

        if (!["CONFIRMED", "CANCELLED"].includes(booking.status)) {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: `Cannot refund a booking with status: ${booking.status}` } },
                { status: 400 },
            );
        }

        if (!booking.payment) {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: "No payment found for this booking" } },
                { status: 400 },
            );
        }

        if (booking.payment.status === "REFUNDED") {
            return NextResponse.json(
                { error: { code: "BAD_REQUEST", message: "Already refunded" } },
                { status: 400 },
            );
        }

        // Attempt Stripe refund
        let refund;
        const paymentIntentId = booking.payment.providerPaymentIntentId;

        if (paymentIntentId) {
            try {
                refund = await stripe.refunds.create({
                    payment_intent: paymentIntentId,
                });
            } catch (stripeError) {
                logger.error("refund.stripe-error", {
                    bookingId,
                    error: String(stripeError),
                });
                return NextResponse.json(
                    { error: { code: "STRIPE_ERROR", message: "Stripe refund failed. Check Stripe dashboard." } },
                    { status: 502 },
                );
            }
        } else {
            logger.warn("refund.no-payment-intent", { bookingId });
            // In test mode or if payment intent wasn't captured, simulate
        }

        // Update DB
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    status: "REFUNDED",
                    refundedAt: new Date(),
                    refundId: refund?.id || "manual",
                    refundAmountUsd: booking.payment.amountUsd,
                },
            }),
            prisma.booking.update({
                where: { id: bookingId },
                data: { status: "REFUNDED" },
            }),
        ]);

        logger.refundIssued(bookingId, refund?.id || "manual", booking.payment.amountUsd);

        return NextResponse.json({
            message: "Refund issued successfully",
            bookingId,
            refundId: refund?.id || "manual",
            amountUsd: booking.payment.amountUsd,
        });
    } catch (error) {
        logger.error("refund.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Failed to issue refund" } },
            { status: 500 },
        );
    }
}
