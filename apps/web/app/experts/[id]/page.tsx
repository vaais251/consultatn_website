import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        select: { name: true },
    });
    return {
        title: user ? `${user.name} — GB Guide Expert` : "Expert Profile",
        description: user ? `Book a consultation with ${user.name}, a verified local expert from Gilgit-Baltistan.` : "",
    };
}

export default async function ExpertProfilePage({ params }: Props) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id, role: "EXPERT" },
        include: {
            expertProfile: true,
        },
    });

    if (!user || !user.expertProfile || !user.expertProfile.isActive) {
        notFound();
    }

    const expert = user.expertProfile;

    // Count available slots next 14 days
    const now = new Date();
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const availableSlots = await prisma.availabilitySlot.count({
        where: {
            expertId: expert.id,
            status: "AVAILABLE",
            startAt: { gte: now, lte: twoWeeks },
        },
    });

    const whatYouGet = [
        "60-minute HD video consultation",
        "Custom itinerary for your trip",
        "Local restaurant & lodge recommendations",
        "Safety tips and permit guidance",
        "WhatsApp follow-up support (48h)",
        "Printable travel plan PDF",
    ];

    return (
        <section className="section-padding">
            <div className="page-container max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-slate-500">
                    <Link href="/experts" className="hover:text-accent-400 transition-colors">
                        ← Back to Experts
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Card */}
                        <div className="glass rounded-2xl p-8">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-3xl font-heading shrink-0">
                                    {user.name.split(" ").map((w) => w[0]).join("")}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            Verified
                                        </span>
                                    </div>
                                    <p className="text-accent-400 font-medium mb-1">{expert.specialty}</p>
                                    {expert.region && (
                                        <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {expert.region}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="glass rounded-2xl p-8">
                            <h2 className="text-xl font-heading font-semibold mb-4">About</h2>
                            <p className="text-slate-300 leading-relaxed">{expert.bio}</p>
                        </div>

                        {/* Credentials */}
                        {expert.credentials && (
                            <div className="glass rounded-2xl p-8">
                                <h2 className="text-xl font-heading font-semibold mb-4">Credentials</h2>
                                <ul className="space-y-2">
                                    {expert.credentials.split(",").map((cred) => (
                                        <li key={cred.trim()} className="flex items-start gap-3 text-slate-300">
                                            <svg className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {cred.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Languages */}
                        {expert.languages && (
                            <div className="glass rounded-2xl p-8">
                                <h2 className="text-xl font-heading font-semibold mb-4">Languages</h2>
                                <div className="flex flex-wrap gap-2">
                                    {expert.languages.split(",").map((lang) => (
                                        <span
                                            key={lang.trim()}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm"
                                        >
                                            {lang.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* What You Get */}
                        <div className="glass rounded-2xl p-8">
                            <h2 className="text-xl font-heading font-semibold mb-4">What You&apos;ll Get</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {whatYouGet.map((item) => (
                                    <div key={item} className="flex items-start gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Placeholder */}
                        <div className="glass rounded-2xl p-8">
                            <h2 className="text-xl font-heading font-semibold mb-4">Reviews</h2>
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-sm">Reviews coming soon. Be the first to book!</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Widget (Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-2xl p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-heading font-bold gradient-text mb-1">
                                    ${expert.hourlyRate ?? 50}
                                </div>
                                <p className="text-slate-500 text-sm">per session</p>
                            </div>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span>Availability</span>
                                    <span className="text-accent-400 font-medium">
                                        {availableSlots} slots open
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span>Duration</span>
                                    <span>60 minutes</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span>Format</span>
                                    <span>HD Video Call</span>
                                </div>
                            </div>

                            <Link
                                href={`/book/${user.id}`}
                                className="btn-accent w-full text-center block !py-3"
                            >
                                Book Consultation
                            </Link>

                            <p className="text-slate-500 text-xs text-center mt-4">
                                🔒 Secure checkout · No card stored
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
