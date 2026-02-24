import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About & Experts — GB Guide",
    description:
        "Meet the verified local experts from Gilgit-Baltistan. Experienced guides, mountaineers, cultural ambassadors, and travel specialists.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Meet Our <span className="gradient-text">Local Experts</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Every expert on GB Guide is a verified local from Gilgit-Baltistan
                        — people who know the trails, the culture, the hidden gems, and the
                        logistics like the back of their hand.
                    </p>
                </div>
            </section>

            {/* Expert Grid Placeholder */}
            <section className="section-padding !pt-0">
                <div className="page-container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Ahmad Khan", specialty: "Trekking & Mountaineering", region: "Hunza Valley" },
                            { name: "Fatima Bibi", specialty: "Cultural Tours & Photography", region: "Skardu" },
                            { name: "Ali Hassan", specialty: "Family Travel & Logistics", region: "Fairy Meadows" },
                        ].map((expert) => (
                            <div key={expert.name} className="glass rounded-2xl p-6 hover:border-accent-400/20 transition-all group">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-400/20 flex items-center justify-center mb-4 text-2xl font-heading font-bold text-accent-400">
                                    {expert.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <h3 className="text-xl font-heading font-semibold mb-1">{expert.name}</h3>
                                <p className="text-accent-400 text-sm font-medium mb-1">{expert.specialty}</p>
                                <p className="text-slate-400 text-sm mb-4">📍 {expert.region}</p>
                                <Link href="/services" className="text-sm text-primary-400 hover:text-accent-400 transition-colors font-medium">
                                    View Profile & Book →
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* TODO notice */}
                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Dynamic expert profiles will be loaded from the database.
                            Each profile will include bio, ratings, availability calendar, and specialties.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
