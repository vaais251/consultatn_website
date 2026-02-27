import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { blogPostSchema } from "@/app/lib/validations";

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
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(post);
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
        const parsed = blogPostSchema.parse(body);

        // Check slug uniqueness (exclude current)
        const existing = await prisma.blogPost.findFirst({
            where: { slug: parsed.slug, NOT: { id } },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A blog post with this slug already exists." },
                { status: 409 }
            );
        }

        // Get current post to check status transitions
        const currentPost = await prisma.blogPost.findUnique({ where: { id } });

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title: parsed.title,
                slug: parsed.slug,
                excerpt: parsed.excerpt || null,
                coverImageUrl: parsed.coverImageUrl || null,
                content: parsed.content || null,
                status: parsed.status,
                publishedAt:
                    parsed.status === "PUBLISHED" && currentPost?.status !== "PUBLISHED"
                        ? new Date()
                        : parsed.status !== "PUBLISHED"
                            ? null
                            : undefined,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
        }
        console.error("Update blog post error:", error);
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
