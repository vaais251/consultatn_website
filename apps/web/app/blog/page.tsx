import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export const metadata: Metadata = {
    title: "Travel Blog — GB Guide",
    description: "Stories, tips, and guides from travelers and local experts about exploring Gilgit-Baltistan, Pakistan.",
    openGraph: {
        title: "Travel Blog — GB Guide",
        description: "Expert travel stories and guides for Gilgit-Baltistan.",
    },
};

function readingTime(text: string | null): string {
    if (!text) return "1 min read";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImageUrl: true,
            content: true,
            publishedAt: true,
            author: { select: { name: true } },
        },
    });

    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Travel <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Stories from the mountains — expert tips, traveler tales, and
                        insider knowledge about Gilgit-Baltistan.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container max-w-4xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <p className="text-4xl mb-4">📰</p>
                            <p className="text-slate-400">No blog posts published yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="glass rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:border-accent-400/20 transition-all"
                                >
                                    {/* Cover Image */}
                                    <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                        {post.coverImageUrl ? (
                                            <img
                                                src={post.coverImageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center">
                                                <span className="text-4xl">📝</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1">
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                            {post.publishedAt && (
                                                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                                            )}
                                            <span>•</span>
                                            <span>{readingTime(post.content)}</span>
                                            {post.author && (
                                                <>
                                                    <span>•</span>
                                                    <span>{post.author.name}</span>
                                                </>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-heading font-semibold mb-2 group-hover:text-accent-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                            {post.excerpt || post.content?.slice(0, 200)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
