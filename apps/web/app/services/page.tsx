import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Services & Pricing — GB Guide",
    description:
        "Explore our video consultation plans. Get personalized travel advice from local Gilgit-Baltistan experts at affordable rates.",
};

export default function ServicesPage() {
    return (
        <>
            {/* Hero */}
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Services & <span className="gradient-text">Pricing</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Transparent pricing in USD. Choose the plan that fits your trip.
                        All consultations include a custom itinerary.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="section-padding !pt-0">
                <div className="page-container">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Quick Chat",
                                price: "$29",
                                duration: "30 min",
                                features: ["Basic route planning", "Top 3 must-see spots", "Packing checklist", "Email follow-up"],
                                popular: false,
                            },
                            {
                                name: "Full Consultation",
                                price: "$59",
                                duration: "60 min",
                                features: ["Complete custom itinerary", "Day-by-day plan", "Hotel & transport tips", "WhatsApp support (7 days)", "Visa guidance"],
                                popular: true,
                            },
                            {
                                name: "Premium Package",
                                price: "$99",
                                duration: "90 min",
                                features: ["Everything in Full", "Multi-region planning", "Booking assistance", "WhatsApp support (30 days)", "Emergency local contact"],
                                popular: false,
                            },
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-2xl p-8 transition-all ${plan.popular
                                        ? "bg-gradient-to-b from-primary-900/80 to-primary-950/80 border-2 border-accent-400/30 scale-105"
                                        : "glass"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="text-accent-400 text-xs font-bold tracking-widest uppercase mb-4">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-heading font-semibold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-4xl font-heading font-bold gradient-text">{plan.price}</span>
                                    <span className="text-slate-400 text-sm">/ session</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-6">{plan.duration} video call</p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                                            <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/login"
                                    className={plan.popular ? "btn-accent w-full" : "btn-outline w-full"}
                                >
                                    Book Now
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Integrate Stripe payment gateway.
                            Dynamic pricing from database. Booking calendar integration.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
