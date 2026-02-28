import { NextResponse } from "next/server";
import { contactLimiter, getClientIp } from "@/app/lib/rate-limit";
import { logger } from "@/app/lib/logger";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    _hp: z.string().optional(), // honeypot
});

/**
 * POST /api/contact
 *
 * Contact form submission with rate limiting and honeypot bot protection.
 */
export async function POST(req: Request) {
    try {
        // Rate limit check
        const ip = getClientIp(req);
        if (contactLimiter.check(ip, "/api/contact")) {
            logger.rateLimited(ip, "/api/contact");
            return NextResponse.json(
                { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
                { status: 429 },
            );
        }

        const body = await req.json();
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: { code: "VALIDATION", message: result.error.issues[0].message } },
                { status: 400 },
            );
        }

        const { name, email, message, _hp } = result.data;

        // Honeypot check — if filled, silently accept (bot trap)
        if (_hp) {
            logger.info("contact.honeypot-triggered", { ip });
            return NextResponse.json({ message: "Thank you! We'll get back to you soon." });
        }

        // Log the contact submission (avoid logging full message content)
        logger.info("contact.submitted", { email, nameLength: name.length, messageLength: message.length });

        // TODO: Wire to email provider (Resend/SendGrid) in production
        // For now, log to console
        console.log("\n" + "═".repeat(60));
        console.log("📬 CONTACT FORM SUBMISSION");
        console.log(`   From: ${name} <${email}>`);
        console.log(`   Message: ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}`);
        console.log("═".repeat(60) + "\n");

        return NextResponse.json({ message: "Thank you! We'll get back to you soon." });
    } catch (error) {
        logger.error("contact.submission.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Failed to submit message" } },
            { status: 500 },
        );
    }
}
