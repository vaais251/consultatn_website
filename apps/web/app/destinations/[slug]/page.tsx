import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const dest = await prisma.destination.findUnique({
        where: { slug, isPublished: true },
        select: { title: true, summary: true, heroImageUrl: true },
    });

    if (!dest) return { title: "Destination Not Found — GB Guide" };

    return {
        title: `${dest.title} — GB Guide`,
        description: dest.summary,
        openGraph: {
            title: `${dest.title} — Explore with GB Guide`,
            description: dest.summary,
            images: dest.heroImageUrl ? [dest.heroImageUrl] : [],
        },
    };
}

export default async function DestinationDetailPage({ params }: Props) {
    const { slug } = await params;

    const destination = await prisma.destination.findUnique({
        where: { slug, isPublished: true },
    });

    if (!destination) notFound();

    // Get related destinations (same region, exclude current)
    const related = await prisma.destination.findMany({
        where: {
            isPublished: true,
            region: destination.region,
            NOT: { id: destination.id },
        },
        take: 3,
        select: { title: true, slug: true, summary: true, heroImageUrl: true, region: true },
    });

    const difficultyColor: Record<string, string> = {
        EASY: "bg-emerald-500/20 text-emerald-400",
        MODERATE: "bg-accent-500/20 text-accent-400",
        HARD: "bg-red-500/20 text-red-400",
    };

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: destination.title,
        description: destination.summary,
        image: destination.heroImageUrl || undefined,
        touristType: destination.difficulty || "Adventure Traveler",
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="relative min-h-[50vh] flex items-end">
                {destination.heroImageUrl ? (
                    <img
                        src={destination.heroImageUrl}
                        alt={destination.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-navy-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

                <div className="relative z-10 page-container pb-12 pt-32">
                    <Link href="/destinations" className="text-sm text-accent-400 hover:text-accent-300 transition-colors mb-4 inline-flex items-center gap-1">
                        ← All Destinations
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
                        {destination.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-white/10 text-sm text-white">
                            📍 {destination.region}
                        </span>
                        {destination.difficulty && (
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${difficultyColor[destination.difficulty] || "bg-slate-500/20 text-slate-400"}`}>
                                ⛰️ {destination.difficulty}
                            </span>
                        )}
                        {destination.bestSeason && (
                            <span className="px-3 py-1 rounded-lg bg-white/10 text-sm text-white">
                                🗓️ {destination.bestSeason}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding !pt-8">
                <div className="page-container">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Main content */}
                        <div className="lg:col-span-2">
                            <p className="text-lg text-slate-300 leading-relaxed mb-8 border-l-4 border-accent-400 pl-5">
                                {destination.summary}
                            </p>
                            <MarkdownRenderer content={destination.content} />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* CTA */}
                            <div className="glass rounded-2xl p-6 sticky top-24">
                                <h3 className="font-heading font-semibold text-lg mb-3">
                                    Planning a trip here?
                                </h3>
                                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                                    Book a video consultation with a local expert who knows {destination.region} inside and out.
                                </p>
                                <Link href="/experts" className="btn-accent w-full text-sm !py-3">
                                    Find a Local Expert
                                </Link>
                                <Link href="/services" className="btn-outline w-full text-sm !py-3 mt-3">
                                    View Pricing
                                </Link>
                            </div>

                            {/* Quick Facts */}
                            <div className="glass rounded-2xl p-6">
                                <h3 className="font-heading font-semibold text-lg mb-4">Quick Facts</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Region</span>
                                        <span className="text-white font-medium">{destination.region}</span>
                                    </div>
                                    {destination.difficulty && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Difficulty</span>
                                            <span className="text-white font-medium">{destination.difficulty}</span>
                                        </div>
                                    )}
                                    {destination.bestSeason && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Best Season</span>
                                            <span className="text-white font-medium">{destination.bestSeason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Destinations */}
            {related.length > 0 && (
                <section className="section-padding !pt-0">
                    <div className="page-container">
                        <h2 className="text-2xl font-heading font-bold mb-6">
                            More in <span className="gradient-text">{destination.region}</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {related.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={`/destinations/${rel.slug}`}
                                    className="glass rounded-2xl overflow-hidden group hover:border-accent-400/20 transition-all"
                                >
                                    <div className="h-36 relative overflow-hidden">
                                        {rel.heroImageUrl ? (
                                            <img src={rel.heroImageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center">
                                                <span className="text-3xl">🏔️</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-heading font-semibold group-hover:text-accent-400 transition-colors">{rel.title}</h3>
                                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{rel.summary}</p>
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
