import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { registerSchema } from "@/app/lib/validations";
import { registerLimiter, getClientIp } from "@/app/lib/rate-limit";
import { logger } from "@/app/lib/logger";

export async function POST(req: Request) {
    try {
        // Rate limit check
        const ip = getClientIp(req);
        if (registerLimiter.check(ip, "/api/register")) {
            logger.rateLimited(ip, "/api/register");
            return NextResponse.json(
                { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
                { status: 429 },
            );
        }

        const body = await req.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: { code: "VALIDATION", message: result.error.issues[0].message } },
                { status: 400 },
            );
        }

        const { name, email, password, country } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: { code: "CONFLICT", message: "An account with this email already exists" } },
                { status: 409 },
            );
        }

        // Hash password with cost factor 12
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user + client profile
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                country,
                role: "CLIENT",
                clientProfile: { create: {} },
            },
            select: { id: true, name: true, email: true, role: true },
        });

        logger.info("user.registered", { userId: user.id, email: user.email });

        return NextResponse.json(
            { message: "Account created successfully", user },
            { status: 201 },
        );
    } catch (error) {
        logger.error("registration.failed", { error: String(error) });
        return NextResponse.json(
            { error: { code: "INTERNAL", message: "Something went wrong. Please try again." } },
            { status: 500 },
        );
    }
}
