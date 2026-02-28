import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { stripe } from "@/app/lib/stripe";
import { logger } from "@/app/lib/logger";
import { generateMeetingLink } from "@/app/lib/meeting";
import { sendClientConfirmation, sendExpertNotification } from "@/app/lib/email";
import Stripe from "stripe";

export async function POST(req: Request) {
    let event: Stripe.Event;

    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Missing signature" } }, { status: 400 });
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            logger.error("webhook.config.missing", { detail: "STRIPE_WEBHOOK_SECRET not configured" });
            return NextResponse.json({ error: { code: "CONFIG", message: "Webhook not configured" } }, { status: 500 });
        }

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        logger.error("webhook.signature.failed", { error: String(err) });
        return NextResponse.json({ error: { code: "SIGNATURE", message: "Webhook signature verification failed" } }, { status: 400 });
    }

    // Handle checkout completion
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
            logger.warn("webhook.no-booking-id", { sessionId: session.id });
            return NextResponse.json({ received: true });
        }

        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    slot: true,
                    expert: { include: { user: { select: { name: true, email: true } } } },
                    payment: true,
                    client: true,
                },
            });

            if (!booking) {
                logger.warn("webhook.booking-not-found", { bookingId });
                return NextResponse.json({ received: true });
            }

            // Idempotency: skip if already confirmed
            if (booking.status === "CONFIRMED" && booking.payment?.status === "PAID") {
                logger.info("webhook.idempotent-skip", { bookingId });
                return NextResponse.json({ received: true });
            }

            // Reject if booking expired
            if (booking.status === "EXPIRED") {
                logger.warn("webhook.payment-after-expiry", { bookingId });
                // TODO: auto-refund via Stripe if payment came after expiry
                return NextResponse.json({ received: true });
            }

            const meetingLink = booking.meetingLink || generateMeetingLink(bookingId);

            // Transaction: Payment → PAID, Booking → CONFIRMED, Slot → BOOKED (clear reservation)
            await prisma.$transaction([
                prisma.payment.update({
                    where: { bookingId },
                    data: {
                        status: "PAID",
                        providerPaymentIntentId: session.payment_intent as string || null,
                    },
                }),
                prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: "CONFIRMED", meetingLink },
                }),
                prisma.availabilitySlot.update({
                    where: { id: booking.slotId },
                    data: {
                        status: "BOOKED",
                        reservedUntil: null,
                        // Keep reservedByBookingId for audit trail
                    },
                }),
            ]);

            logger.paymentConfirmed(bookingId, booking.payment?.amountUsd || 0);

            // Format date/time for emails
            const dateTime = new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Karachi",
                timeZoneName: "short",
            }).format(new Date(booking.slot.startAt));

            // Send confirmation emails
            await Promise.all([
                sendClientConfirmation({
                    clientEmail: booking.client.email,
                    clientName: booking.client.name,
                    expertName: booking.expert.user.name,
                    dateTime,
                    meetingLink,
                }),
                sendExpertNotification({
                    expertEmail: booking.expert.user.email,
                    expertName: booking.expert.user.name,
                    clientName: booking.client.name,
                    clientCountry: booking.client.country || "Unknown",
                    dateTime,
                    meetingLink,
                    bookingId: booking.id,
                }),
            ]);

            logger.info("webhook.booking-confirmed", { bookingId });
        } catch (err) {
            logger.error("webhook.processing-error", { bookingId, error: String(err) });
            return NextResponse.json({ received: true });
        }
    }

    return NextResponse.json({ received: true });
}
