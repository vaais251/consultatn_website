import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { stripe } from "@/app/lib/stripe";
import { generateMeetingLink } from "@/app/lib/meeting";
import { sendClientConfirmation, sendExpertNotification } from "@/app/lib/email";
import Stripe from "stripe";

export async function POST(req: Request) {
    let event: Stripe.Event;

    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("STRIPE_WEBHOOK_SECRET not configured");
            return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
        }

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    // Handle events
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
            console.warn("Webhook: No bookingId in metadata");
            return NextResponse.json({ received: true });
        }

        try {
            // Fetch booking with relations
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    slot: true,
                    expert: { include: { user: { select: { name: true, email: true } } } },
                    payment: true,
                    client: true, // the User who booked
                },
            });

            if (!booking) {
                console.warn(`Webhook: Booking ${bookingId} not found`);
                return NextResponse.json({ received: true });
            }

            // Idempotency: skip if already confirmed
            if (booking.status === "CONFIRMED" && booking.payment?.status === "PAID") {
                console.log(`Webhook: Booking ${bookingId} already confirmed, skipping`);
                return NextResponse.json({ received: true });
            }

            // Generate meeting link
            const meetingLink = booking.meetingLink || generateMeetingLink(bookingId);

            // Update DB: Payment → PAID, Booking → CONFIRMED, set meetingLink
            await prisma.$transaction([
                prisma.payment.update({
                    where: { bookingId },
                    data: { status: "PAID" },
                }),
                prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: "CONFIRMED", meetingLink },
                }),
            ]);

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

            console.log(`✅ Booking ${bookingId} confirmed via Stripe webhook`);
        } catch (err) {
            console.error(`Webhook processing error for booking ${bookingId}:`, err);
            // Still return 200 to prevent Stripe retries that would fail the same way
            return NextResponse.json({ received: true });
        }
    }

    return NextResponse.json({ received: true });
}
