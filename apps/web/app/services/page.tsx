import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/app/components/Hero";
import { Section } from "@/app/components/Section";
import TestimonialSection from "@/app/components/TestimonialSection";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "Services & Pricing — The North Route",
    description: "Explore our video consultation plans. Get personalized travel advice from local Gilgit-Baltistan experts at affordable rates.",
};

export default function ServicesPage() {
    return (
        <>
            <Hero
                backgroundImage={images.servicesHero}
                compact
                title={<>Services & <span className="gradient-text">Pricing</span></>}
                subtitle="Transparent pricing in USD. Choose the plan that fits your trip. All consultations include a custom itinerary."
            />

            <Section eyebrow="Plans" title="Choose Your Consultation" subtitle="Every session includes a personalized itinerary and follow-up support." centered>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { name: "Quick Chat", price: "$29", duration: "30 min", features: ["Basic route planning", "Top 3 must-see spots", "Packing checklist", "Email follow-up"], popular: false },
                        { name: "Full Consultation", price: "$59", duration: "60 min", features: ["Complete custom itinerary", "Day-by-day plan", "Hotel & transport tips", "WhatsApp support (7 days)", "Visa guidance"], popular: true },
                        { name: "Premium Package", price: "$99", duration: "90 min", features: ["Everything in Full", "Multi-region planning", "Booking assistance", "WhatsApp support (30 days)", "Emergency local contact"], popular: false },
                    ].map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-8 transition-all duration-300 border hover:-translate-y-1 ${plan.popular
                                ? "border-accent-400/40 scale-105 relative"
                                : "border-[var(--border)]"
                                }`}
                            style={{ background: "var(--surface)", boxShadow: plan.popular ? "0 8px 40px rgba(245,158,11,0.12)" : "var(--shadow-sm)" }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-navy-950 text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full">
                                    Best Value
                                </div>
                            )}
                            <h3 className="text-xl font-heading font-semibold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-heading font-bold gradient-text">{plan.price}</span>
                                <span className="text-[var(--text-muted)] text-sm">/ session</span>
                            </div>
                            <p className="text-[var(--text-muted)] text-sm mb-6">{plan.duration} video call</p>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/experts" className={plan.popular ? "btn-accent w-full" : "btn-outline w-full"}>
                                Book Now
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[var(--text-muted)] text-sm">
                        All plans include secure Stripe payment. <Link href="/refund-policy" className="text-accent-500 hover:underline">View refund policy →</Link>
                    </p>
                </div>
            </Section>

            <TestimonialSection title="Why Travelers Choose Us" subtitle="Real feedback from travelers who booked consultations." />
        </>
    );
}
