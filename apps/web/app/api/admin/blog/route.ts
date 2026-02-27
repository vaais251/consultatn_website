import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { blogPostSchema, slugify } from "@/app/lib/validations";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return null;
    return session;
}

export async function GET() {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
    });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await request.json();

        if (!body.slug && body.title) {
            body.slug = slugify(body.title);
        }

        const parsed = blogPostSchema.parse(body);

        // Check slug uniqueness
        const existing = await prisma.blogPost.findUnique({
            where: { slug: parsed.slug },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A blog post with this slug already exists. Please use a different slug." },
                { status: 409 }
            );
        }

        const post = await prisma.blogPost.create({
            data: {
                title: parsed.title,
                slug: parsed.slug,
                excerpt: parsed.excerpt || null,
                coverImageUrl: parsed.coverImageUrl || null,
                content: parsed.content || null,
                status: parsed.status,
                authorId: session.user.id,
                publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
        }
        console.error("Create blog post error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
