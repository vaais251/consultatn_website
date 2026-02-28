import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { stripe, getAmountForDuration } from "@/app/lib/stripe";
import { checkoutLimiter, getClientIp } from "@/app/lib/rate-limit";
import { logger } from "@/app/lib/logger";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
        }

        // Rate limit check
        const ip = getClientIp(req);
        if (checkoutLimiter.check(ip, "/api/payments/checkout")) {
            logger.rateLimited(ip, "/api/payments/checkout");
            return NextResponse.json(
                { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
                { status: 429 },
            );
        }

        const body = await req.json();
        const { bookingId } = body;
        if (!bookingId) {
            return NextResponse.json({ error: "bookingId required" }, { status: 400 });
        }

        // Fetch booking with slot and expert
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                slot: true,
                expert: { include: { user: { select: { name: true, email: true } } } },
                payment: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Ownership check
        if (booking.clientId !== session.user.id) {
            return NextResponse.json({ error: "Not your booking" }, { status: 403 });
        }

        // Status check
        if (booking.status !== "PENDING_PAYMENT") {
            return NextResponse.json(
                { error: `Booking is already ${booking.status.toLowerCase()}` },
                { status: 400 },
            );
        }

        // If payment already PAID or INITIATED with existing session, check
        if (booking.payment?.status === "PAID") {
            return NextResponse.json({ error: "Already paid" }, { status: 400 });
        }

        // Calculate duration and price
        const durationMs = new Date(booking.slot.endAt).getTime() - new Date(booking.slot.startAt).getTime();
        const durationMin = Math.round(durationMs / 60000);
        const { amountCents, amountUsd, label } = getAmountForDuration(durationMin);

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: session.user.email || undefined,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `The North Route — ${label}`,
                            description: `Consultation with ${booking.expert.user.name}`,
                        },
                        unit_amount: amountCents,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: booking.id,
            },
            success_url: `${baseUrl}/dashboard/bookings/${booking.id}?paid=1`,
            cancel_url: `${baseUrl}/dashboard/bookings/${booking.id}?canceled=1`,
        });

        // Upsert Payment record
        if (booking.payment) {
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    status: "INITIATED",
                    providerSessionId: checkoutSession.id,
                    amountUsd,
                },
            });
        } else {
            await prisma.payment.create({
                data: {
                    bookingId: booking.id,
                    provider: "stripe",
                    amountUsd,
                    currency: "USD",
                    status: "INITIATED",
                    providerSessionId: checkoutSession.id,
                },
            });
        }

        logger.checkoutSessionCreated(booking.id, checkoutSession.id);

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        logger.error("checkout.failed", { error: String(error) });
        return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to create checkout session" } }, { status: 500 });
    }
}
