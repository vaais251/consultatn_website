import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import VerifiedBadge from "@/app/components/VerifiedBadge";
import TestimonialSection from "@/app/components/TestimonialSection";
import Hero from "@/app/components/Hero";
import { images } from "@/app/config/images";

export const metadata = {
    title: "Our Experts — The North Route",
    description: "Meet verified local experts from Gilgit-Baltistan. Book a consultation for personalized travel advice.",
};

export default async function ExpertsPage() {
    const experts = await prisma.expertProfile.findMany({
        where: { isActive: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
    });

    return (
        <>
            <Hero
                backgroundImage={images.expertsHero}
                compact
                title={<>Meet Your <span className="gradient-text">Local Experts</span></>}
                subtitle="Each expert is a verified local with deep knowledge of Gilgit-Baltistan. Book a video consultation and get a custom itinerary tailored to you."
                badges={["Verified Locals", "Secure Payments", "HD Video Calls"]}
            />

            <section className="section-padding" style={{ background: "var(--bg)" }}>
                <div className="page-container">
                    {experts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[var(--text-muted)] text-lg">No experts available right now. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {experts.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="rounded-2xl overflow-hidden group transition-all duration-300 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1"
                                    style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
                                >
                                    <div className="h-48 bg-gradient-to-br from-primary-600/20 to-accent-400/10 flex items-center justify-center relative">
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-3xl font-heading group-hover:scale-110 transition-transform duration-300">
                                            {expert.user.name.split(" ").map((w) => w[0]).join("")}
                                        </div>
                                        {expert.isVerified && (
                                            <div className="absolute top-4 right-4"><VerifiedBadge /></div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-heading font-semibold mb-1">{expert.user.name}</h3>
                                        <p className="text-accent-500 text-sm font-medium mb-3">{expert.specialty}</p>

                                        {expert.region && (
                                            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-3">
                                                📍 {expert.region}
                                            </div>
                                        )}

                                        <p className="text-[var(--text-muted)] text-sm line-clamp-3 mb-4">{expert.bio}</p>

                                        {expert.languages && (
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {expert.languages.split(",").map((lang) => (
                                                    <span key={lang.trim()} className="px-2 py-0.5 rounded-md bg-accent-400/10 text-[var(--text-secondary)] text-xs">
                                                        {lang.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                            <div>
                                                <span className="text-2xl font-heading font-bold">${expert.hourlyRate ?? 50}</span>
                                                <span className="text-[var(--text-muted)] text-sm">/session</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/experts/${expert.user.id}`} className="btn-outline text-xs !py-2 !px-3">
                                                    View Profile
                                                </Link>
                                                <Link href={`/book/${expert.user.id}`} className="btn-accent text-xs !py-2 !px-3">
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <TestimonialSection title="Trusted by Travelers" subtitle="Hear from adventurers who planned their trips with our experts." />
        </>
    );
}
