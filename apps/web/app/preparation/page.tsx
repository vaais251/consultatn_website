import type { Metadata } from "next";
import Hero from "@/app/components/Hero";
import { Section, CTASection } from "@/app/components/Section";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "Preparation & Culture — The North Route",
    description: "Learn about Gilgit-Baltistan culture, etiquette, packing tips, altitude sickness prevention, and how to prepare for your trip.",
};

export default function PreparationPage() {
    return (
        <>
            <Hero
                backgroundImage={images.cultureHero}
                compact
                title={<>Preparation & <span className="gradient-text">Culture</span></>}
                subtitle="Understand the culture, prepare for the altitude, and pack smart. A well-prepared traveler has the best experience."
            />

            <Section eyebrow="Get Ready" title="Essential Travel Preparation" subtitle="Everything you need to know before your trip.">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[
                        { icon: "🎒", title: "Packing Essentials", desc: "Layered clothing, sun protection, sturdy shoes, power bank, headlamp, and first-aid kit. Your expert will customize this for your specific trek." },
                        { icon: "⛰️", title: "Altitude Tips", desc: "GB ranges from 1,500m to 8,611m. Acclimatize slowly, stay hydrated, and know the signs of altitude sickness." },
                        { icon: "🕌", title: "Cultural Etiquette", desc: "GB is home to diverse ethnic groups and languages. Respect local customs — ask before photographing people, dress modestly, and greet warmly." },
                        { icon: "🍽️", title: "Local Cuisine", desc: "Try chapshoro (meat pie), diram fitti, salt tea, and fresh apricots. Your expert can guide you to the best local eateries." },
                        { icon: "📸", title: "Photography", desc: "Golden hour in Passu, starry skies in Deosai, reflections in Attabad Lake. Bring a wide-angle lens and extra batteries." },
                        { icon: "💬", title: "Language", desc: "Urdu is widely understood. English is spoken in tourist areas. Learning basic greetings in Burushaski or Shina will delight locals." },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl p-6 border border-[var(--border)] flex gap-5 items-start hover:border-accent-400/30 transition-all duration-300" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                            <div className="w-12 h-12 rounded-xl bg-accent-400/10 flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                            <div>
                                <h3 className="font-heading font-semibold text-lg mb-1">{item.title}</h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <CTASection
                backgroundImage={images.ctaBanner}
                title="Want a Custom Preparation Plan?"
                subtitle="Our local experts provide personalized packing lists, altitude acclimatization schedules, and cultural briefings."
                cta={{ label: "Talk to an Expert", href: "/experts" }}
            />
        </>
    );
}
