import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visa & Logistics — GB Guide",
    description:
        "Everything you need to know about visas, permits, flights, transport, and logistics for traveling to Gilgit-Baltistan, Pakistan.",
};

export default function VisaPage() {
    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Visa & <span className="gradient-text">Logistics</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Practical travel information — visas, permits, flights, road
                        conditions, SIM cards, money exchange, and more.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {[
                            { title: "Pakistan Visa", desc: "Most nationalities can apply for an e-visa or visa on arrival. Our experts can guide you through the exact process for your country." },
                            { title: "NOC / Permits", desc: "Certain restricted areas in GB require a No Objection Certificate (NOC). We'll help you understand which areas need it and how to apply." },
                            { title: "Getting There", desc: "Flights from Islamabad to Gilgit or Skardu (weather-dependent) or the stunning Karakoram Highway by road (12-18 hours)." },
                            { title: "Local Transport", desc: "Public vans, private jeeps, and hired cars. Our experts help you choose the best option for your group size and budget." },
                            { title: "Money & SIM", desc: "ATMs are scarce outside major towns. Bring cash (PKR). Jazz/Telenor SIMs available in Gilgit and Skardu. Our experts share the latest tips." },
                        ].map((item) => (
                            <div key={item.title} className="glass rounded-2xl p-6">
                                <h3 className="text-lg font-heading font-semibold mb-2 text-accent-400">{item.title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Add country-specific visa lookup tool,
                            downloadable checklists, and affiliate transport booking links.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
