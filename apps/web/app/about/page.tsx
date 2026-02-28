import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/app/components/Hero";
import { Section, CTASection } from "@/app/components/Section";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "About — The North Route",
    description: "Meet the verified local experts from Gilgit-Baltistan. Experienced guides, mountaineers, cultural ambassadors, and travel specialists.",
};

export default function AboutPage() {
    return (
        <>
            <Hero
                backgroundImage={images.aboutHero}
                compact
                title={<>Meet Our <span className="gradient-text">Local Experts</span></>}
                subtitle="Every expert on The North Route is a verified local from Gilgit-Baltistan — people who know the trails, the culture, the hidden gems, and the logistics like the back of their hand."
            />

            <Section
                eyebrow="Our Mission"
                title={<>Why <span className="gradient-text">The North Route</span>?</>}
                subtitle="We believe the best travel advice comes from people who live it every day."
            >
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: "🏔️", title: "Local Knowledge", desc: "Our experts are born and raised in Gilgit-Baltistan. They know every trail, every village, and every hidden waterfall." },
                        { icon: "🛡️", title: "Verified & Trusted", desc: "Every expert goes through our verification process. We check credentials, local residency, and traveler reviews." },
                        { icon: "💳", title: "Secure Payments", desc: "All payments are processed securely through Stripe. Full refund guarantee if your consultation doesn't happen." },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl p-8 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1 transition-all duration-300" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                            <div className="w-14 h-14 rounded-2xl bg-accent-400/10 flex items-center justify-center text-2xl mb-5">{item.icon}</div>
                            <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section eyebrow="The Team" title="Our Experts" subtitle="Verified locals ready to plan your perfect trip.">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: "Ahmad Khan", specialty: "Trekking & Mountaineering", region: "Hunza Valley" },
                        { name: "Fatima Bibi", specialty: "Cultural Tours & Photography", region: "Skardu" },
                        { name: "Ali Hassan", specialty: "Family Travel & Logistics", region: "Fairy Meadows" },
                    ].map((expert) => (
                        <div key={expert.name} className="rounded-2xl p-6 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1 transition-all duration-300 group" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-400/20 flex items-center justify-center mb-4 text-2xl font-heading font-bold text-accent-500">
                                {expert.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <h3 className="text-xl font-heading font-semibold mb-1">{expert.name}</h3>
                            <p className="text-accent-500 text-sm font-medium mb-1">{expert.specialty}</p>
                            <p className="text-[var(--text-muted)] text-sm mb-4">📍 {expert.region}</p>
                            <Link href="/experts" className="text-sm text-primary-400 hover:text-accent-500 transition-colors font-medium">
                                View Profile & Book →
                            </Link>
                        </div>
                    ))}
                </div>
            </Section>

            <CTASection
                backgroundImage={images.ctaBanner}
                title="Ready to Plan Your Trip?"
                subtitle="Connect with a verified local expert and get a custom itinerary for your Gilgit-Baltistan adventure."
                cta={{ label: "Book a Consultation", href: "/experts" }}
            />
        </>
    );
}
