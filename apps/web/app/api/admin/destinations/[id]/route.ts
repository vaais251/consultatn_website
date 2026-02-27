import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { destinationSchema } from "@/app/lib/validations";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return null;
    return session;
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(destination);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = destinationSchema.parse(body);

        // Check slug uniqueness (exclude current)
        const existing = await prisma.destination.findFirst({
            where: { slug: parsed.slug, NOT: { id } },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A destination with this slug already exists." },
                { status: 409 }
            );
        }

        const destination = await prisma.destination.update({
            where: { id },
            data: {
                title: parsed.title,
                slug: parsed.slug,
                heroImageUrl: parsed.heroImageUrl || null,
                summary: parsed.summary,
                content: parsed.content,
                region: parsed.region,
                difficulty: parsed.difficulty || null,
                bestSeason: parsed.bestSeason || null,
                isPublished: parsed.isPublished,
            },
        });

        return NextResponse.json(destination);
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
        }
        console.error("Update destination error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
