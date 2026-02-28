import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const testimonialSchema = z.object({
    name: z.string().min(2),
    country: z.string().min(2),
    quote: z.string().min(10),
    rating: z.number().int().min(1).max(5),
    tripType: z.string().optional(),
    isPublished: z.boolean().optional(),
});

/** GET /api/admin/testimonials — list all */
export async function GET() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin only" } }, { status: 403 });
    }

    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
}

/** POST /api/admin/testimonials — create */
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin only" } }, { status: 403 });
    }

    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: { code: "VALIDATION", message: parsed.error.issues[0].message } }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({ data: parsed.data });
    return NextResponse.json(testimonial, { status: 201 });
}
