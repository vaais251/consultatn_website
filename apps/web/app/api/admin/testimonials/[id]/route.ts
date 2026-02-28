import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().min(2).optional(),
    country: z.string().min(2).optional(),
    quote: z.string().min(10).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    tripType: z.string().optional(),
    isPublished: z.boolean().optional(),
});

/** PATCH /api/admin/testimonials/[id] — update */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin only" } }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: { code: "VALIDATION", message: parsed.error.issues[0].message } }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
        where: { id },
        data: parsed.data,
    });
    return NextResponse.json(testimonial);
}

/** DELETE /api/admin/testimonials/[id] */
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin only" } }, { status: 403 });
    }

    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
}
