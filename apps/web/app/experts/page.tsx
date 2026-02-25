import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export const metadata = {
    title: "Our Experts — GB Guide",
    description: "Meet verified local experts from Gilgit-Baltistan. Book a consultation for personalized travel advice.",
};

export default async function ExpertsPage() {
    const experts = await prisma.expertProfile.findMany({
        where: { isActive: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
    });

    return (
        <section className="section-padding">
            <div className="page-container">
                {/* Hero */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent-400/10 text-accent-400 text-xs font-semibold tracking-wider uppercase mb-4">
                        Verified Local Experts
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        Meet Your <span className="gradient-text">GB Guides</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Each expert is a verified local with deep knowledge of Gilgit-Baltistan.
                        Book a video consultation and get a custom itinerary tailored to you.
                    </p>
                </div>

                {/* Expert Grid */}
                {experts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-400 text-lg">No experts available right now. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experts.map((expert) => (
                            <div
                                key={expert.id}
                                className="glass rounded-2xl overflow-hidden group hover:border-accent-400/30 transition-all duration-300"
                            >
                                {/* Photo Area */}
                                <div className="h-48 bg-gradient-to-br from-primary-600/30 to-accent-400/10 flex items-center justify-center relative">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-3xl font-heading group-hover:scale-110 transition-transform duration-300">
                                        {expert.user.name
                                            .split(" ")
                                            .map((w) => w[0])
                                            .join("")}
                                    </div>
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Verified
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-heading font-semibold mb-1">{expert.user.name}</h3>
                                    <p className="text-accent-400 text-sm font-medium mb-3">{expert.specialty}</p>

                                    {expert.region && (
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {expert.region}
                                        </div>
                                    )}

                                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                        {expert.bio}
                                    </p>

                                    {/* Languages */}
                                    {expert.languages && (
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {expert.languages.split(",").map((lang) => (
                                                <span
                                                    key={lang.trim()}
                                                    className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-xs"
                                                >
                                                    {lang.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Rate + Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div>
                                            <span className="text-2xl font-heading font-bold text-white">
                                                ${expert.hourlyRate ?? 50}
                                            </span>
                                            <span className="text-slate-500 text-sm">/session</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/experts/${expert.user.id}`}
                                                className="btn-outline text-xs !py-2 !px-3"
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                href={`/book/${expert.user.id}`}
                                                className="btn-accent text-xs !py-2 !px-3"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Trust Bar */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl glass text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified Locals
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secure Payments
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            HD Video Calls
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
