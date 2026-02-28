import type { Metadata } from "next";
import Hero from "@/app/components/Hero";
import ContactForm from "./ContactForm";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "Contact & FAQ — The North Route",
    description: "Get in touch with The North Route team. Find answers to frequently asked questions about our consultation services.",
};

export default function ContactPage() {
    return (
        <>
            <Hero
                backgroundImage={images.contactHero}
                compact
                title={<>Contact & <span className="gradient-text">FAQ</span></>}
                subtitle="Have questions? We're here to help you plan the perfect trip."
            />

            <section className="section-padding" style={{ background: "var(--bg)" }}>
                <div className="page-container max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                    <ContactForm />

                    <div>
                        <h2 className="text-xl font-heading font-semibold mb-6">Frequently Asked</h2>
                        <div className="space-y-4">
                            {[
                                { q: "How does a video consultation work?", a: "You book a time slot, fill a short pre-consultation form, pay securely, and get a meeting link. Your expert prepares a custom itinerary during the call." },
                                { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards via Stripe (priced in USD). PayPal and Wise support coming soon." },
                                { q: "Can I get a refund?", a: "Full refund if you cancel 24 hours before your session. Partial refund for late cancellations. See our Terms of Service." },
                                { q: "Do I need a visa for Pakistan?", a: "Most nationalities can apply online. Our experts will guide you through the exact process for your country during your consultation." },
                                { q: "Is it safe to travel to GB?", a: "Gilgit-Baltistan is generally very safe for tourists. Our local experts provide up-to-date safety advice specific to your route." },
                            ].map((faq) => (
                                <div key={faq.q} className="rounded-xl p-5 border border-[var(--border)]" style={{ background: "var(--surface)" }}>
                                    <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
