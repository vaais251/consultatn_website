import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact & FAQ — GB Guide",
    description:
        "Get in touch with the GB Guide team. Find answers to frequently asked questions about our consultation services.",
};

export default function ContactPage() {
    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Contact & <span className="gradient-text">FAQ</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Have questions? We&apos;re here to help you plan the perfect trip.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                    {/* Contact Form Placeholder */}
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-xl font-heading font-semibold mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Your Name</label>
                                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Email</label>
                                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Message</label>
                                <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors resize-none" />
                            </div>
                            <button type="button" className="btn-accent w-full">
                                Send Message
                            </button>
                        </form>
                        <p className="text-slate-500 text-xs mt-3 text-center">
                            🚧 Form submission coming soon
                        </p>
                    </div>

                    {/* FAQ */}
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
                                <div key={faq.q} className="glass rounded-xl p-5">
                                    <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
