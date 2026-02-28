import type { Metadata } from "next";
import Hero from "@/app/components/Hero";
import { Section, CTASection } from "@/app/components/Section";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "Visa & Logistics — The North Route",
    description: "Everything you need to know about visas, permits, flights, transport, and logistics for traveling to Gilgit-Baltistan, Pakistan.",
};

export default function VisaPage() {
    return (
        <>
            <Hero
                backgroundImage={images.visaHero}
                compact
                title={<>Visa & <span className="gradient-text">Logistics</span></>}
                subtitle="Practical travel information — visas, permits, flights, road conditions, SIM cards, money exchange, and more."
            />

            <Section eyebrow="Travel Info" title="What You Need to Know" subtitle="Essential logistics for your Gilgit-Baltistan trip.">
                <div className="space-y-5 max-w-4xl mx-auto">
                    {[
                        { icon: "🛂", title: "Pakistan Visa", desc: "Most nationalities can apply for an e-visa or visa on arrival. Our experts can guide you through the exact process for your country." },
                        { icon: "📋", title: "NOC / Permits", desc: "Certain restricted areas in GB require a No Objection Certificate (NOC). We'll help you understand which areas need it and how to apply." },
                        { icon: "✈️", title: "Getting There", desc: "Flights from Islamabad to Gilgit or Skardu (weather-dependent) or the stunning Karakoram Highway by road (12-18 hours)." },
                        { icon: "🚗", title: "Local Transport", desc: "Public vans, private jeeps, and hired cars. Our experts help you choose the best option for your group size and budget." },
                        { icon: "💰", title: "Money & SIM", desc: "ATMs are scarce outside major towns. Bring cash (PKR). Jazz/Telenor SIMs available in Gilgit and Skardu. Our experts share the latest tips." },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl p-6 border border-[var(--border)] flex gap-5 items-start hover:border-accent-400/30 transition-all duration-300" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                            <div className="w-12 h-12 rounded-xl bg-accent-400/10 flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                            <div>
                                <h3 className="text-lg font-heading font-semibold mb-1 text-accent-500">{item.title}</h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <CTASection
                backgroundImage={images.ctaBanner}
                title="Need Personalized Help?"
                subtitle="Book a consultation with a local expert who can guide you through every logistic detail."
                cta={{ label: "Talk to an Expert", href: "/experts" }}
            />
        </>
    );
}
