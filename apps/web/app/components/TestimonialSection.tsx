import { prisma } from "@/app/lib/prisma";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="star-rating text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < rating ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

interface TestimonialSectionProps {
    title?: string;
    subtitle?: string;
    limit?: number;
}

export default async function TestimonialSection({
    title = "What Travelers Say",
    subtitle = "Trusted by adventurers from around the world",
    limit = 3,
}: TestimonialSectionProps) {
    const testimonials = await prisma.testimonial.findMany({
        where: { isPublished: true },
        take: limit,
        orderBy: { createdAt: "desc" },
    });

    if (testimonials.length === 0) return null;

    return (
        <section className="section-padding" style={{ background: "var(--bg)" }}>
            <div className="page-container">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                        {title.split(" ").map((word, i) =>
                            i === title.split(" ").length - 1 ? (
                                <span key={i} className="gradient-text">{word}</span>
                            ) : (
                                <span key={i}>{word} </span>
                            )
                        )}
                    </h2>
                    <p className="text-[var(--text-muted)] max-w-xl mx-auto">{subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-2xl p-6 transition-all flex flex-col border border-[var(--border)] hover:border-accent-400/30"
                            style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
                        >
                            <StarRating rating={t.rating} />
                            <blockquote className="text-[var(--text-secondary)] text-sm leading-relaxed mt-3 mb-4 flex-1">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <div className="border-t border-[var(--border)] pt-4 mt-auto">
                                <p className="font-heading font-semibold text-sm">{t.name}</p>
                                <p className="text-[var(--text-muted)] text-xs">
                                    📍 {t.country}
                                    {t.tripType && <> · {t.tripType}</>}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
