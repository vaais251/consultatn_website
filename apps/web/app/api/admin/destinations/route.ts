import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { destinationSchema, slugify } from "@/app/lib/validations";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return null;
    }
    return session;
}

export async function GET() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const destinations = await prisma.destination.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(destinations);
}

export async function POST(request: Request) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await request.json();

        // Auto-generate slug if not provided
        if (!body.slug && body.title) {
            body.slug = slugify(body.title);
        }

        const parsed = destinationSchema.parse(body);

        // Check slug uniqueness
        const existing = await prisma.destination.findUnique({
            where: { slug: parsed.slug },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A destination with this slug already exists. Please use a different slug." },
                { status: 409 }
            );
        }

        const destination = await prisma.destination.create({
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

        return NextResponse.json(destination, { status: 201 });
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
        }
        console.error("Create destination error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
