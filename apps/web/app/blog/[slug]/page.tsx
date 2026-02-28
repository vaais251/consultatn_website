import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

interface Props {
    params: Promise<{ slug: string }>;
}

function readingTime(text: string | null): string {
    if (!text) return "1 min read";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug, status: "PUBLISHED" },
        select: { title: true, excerpt: true, coverImageUrl: true },
    });

    if (!post) return { title: "Post Not Found — The North Route" };

    return {
        title: `${post.title} — The North Route Blog`,
        description: post.excerpt || `Read ${post.title} on the The North Route travel blog.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on the The North Route travel blog.`,
            images: post.coverImageUrl ? [post.coverImageUrl] : [],
            type: "article",
        },
    };
}

export default async function BlogPostDetailPage({ params }: Props) {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { slug, status: "PUBLISHED" },
        include: { author: { select: { name: true, image: true } } },
    });

    if (!post) notFound();

    // Get related posts (exclude current, limit 3)
    const related = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED", NOT: { id: post.id } },
        take: 3,
        orderBy: { publishedAt: "desc" },
        select: { title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true },
    });

    // JSON-LD Article structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || post.content?.slice(0, 200),
        image: post.coverImageUrl || undefined,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
        publisher: {
            "@type": "Organization",
            name: "The North Route",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="relative">
                {post.coverImageUrl ? (
                    <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
                        <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                    </div>
                ) : (
                    <div className="h-32 bg-gradient-to-b from-primary-950/50 to-transparent" />
                )}
            </section>

            {/* Article */}
            <section className={`section-padding ${post.coverImageUrl ? "!pt-0 -mt-24 relative z-10" : "!pt-8"}`} style={{ background: post.coverImageUrl ? undefined : "var(--bg)" }}>
                <div className="page-container max-w-3xl mx-auto">
                    {/* Meta */}
                    <Link href="/blog" className="text-sm text-accent-400 hover:text-accent-300 transition-colors mb-6 inline-flex items-center gap-1">
                        ← All Posts
                    </Link>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-8 pb-8 border-b border-[var(--border)]">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 text-xs font-bold">
                                    {post.author.name[0]}
                                </div>
                                <span>{post.author.name}</span>
                            </div>
                        )}
                        {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        )}
                        <span>{readingTime(post.content)}</span>
                    </div>

                    {/* Content */}
                    {post.content && <MarkdownRenderer content={post.content} />}

                    {/* Sticky CTA */}
                    <div className="mt-12 rounded-2xl p-8 text-center border border-[var(--border)]" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                        <h3 className="text-xl font-heading font-bold mb-3">
                            Ready to plan your trip?
                        </h3>
                        <p className="text-[var(--text-muted)] mb-5 max-w-lg mx-auto">
                            Book a video consultation with a verified local expert
                            and get a custom itinerary tailored just for you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/experts" className="btn-accent !py-3 !px-6 text-sm">
                                Book a Consultation
                            </Link>
                            <Link href="/services" className="btn-outline !py-3 !px-6 text-sm">
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {related.length > 0 && (
                <section className="section-padding !pt-0" style={{ background: "var(--bg)" }}>
                    <div className="page-container max-w-3xl mx-auto">
                        <h2 className="text-2xl font-heading font-bold mb-6">
                            More from the <span className="gradient-text">Blog</span>
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {related.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={`/blog/${rel.slug}`}
                                    className="rounded-xl overflow-hidden group border border-[var(--border)] hover:border-accent-400/30 transition-all duration-300"
                                    style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
                                >
                                    {rel.coverImageUrl && (
                                        <div className="h-28 overflow-hidden">
                                            <img src={rel.coverImageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-sm font-heading font-semibold group-hover:text-accent-400 transition-colors line-clamp-2">
                                            {rel.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
