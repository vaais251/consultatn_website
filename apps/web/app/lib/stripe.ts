import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️  STRIPE_SECRET_KEY not set — Stripe calls will fail");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    typescript: true,
});

/**
 * Map booking slot duration (minutes) to a Stripe amount in cents.
 * In production, use Stripe Price IDs from env. For now, use direct amounts.
 */
export function getAmountForDuration(durationMinutes: number): {
    amountCents: number;
    amountUsd: number;
    label: string;
} {
    switch (durationMinutes) {
        case 30:
            return { amountCents: 2500, amountUsd: 25, label: "30-Minute Consultation" };
        case 90:
            return { amountCents: 7500, amountUsd: 75, label: "90-Minute Consultation" };
        case 60:
        default:
            return { amountCents: 5000, amountUsd: 50, label: "60-Minute Consultation" };
    }
}
