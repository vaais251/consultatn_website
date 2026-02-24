import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Destinations — GB Guide",
    description:
        "Explore stunning destinations across Gilgit-Baltistan: Hunza Valley, Skardu, Fairy Meadows, Naltar, K2 Base Camp, and more.",
};

export default function DestinationsPage() {
    const destinations = [
        { name: "Hunza Valley", tagline: "The crown jewel of GB", highlights: "Karimabad, Eagle's Nest, Attabad Lake, Passu Cones" },
        { name: "Skardu", tagline: "Gateway to the world's highest peaks", highlights: "Shangrila Resort, Upper Kachura, Deosai Plains" },
        { name: "Fairy Meadows", tagline: "The meadow below Nanga Parbat", highlights: "Nanga Parbat Base Camp, Trek, Stargazing" },
        { name: "Naltar Valley", tagline: "Rainbow Lakes & ski slopes", highlights: "Naltar Lakes, Skiing, Pine Forests" },
        { name: "Khunjerab Pass", tagline: "World's highest paved border crossing", highlights: "China Border, Yaks, High Altitude Views" },
        { name: "K2 Base Camp", tagline: "The ultimate mountaineering trek", highlights: "Concordia, Baltoro Glacier, Gondogoro Pass" },
    ];

    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Discover <span className="gradient-text">Destinations</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        From the soaring peaks of K2 to the serene terraces of Hunza —
                        find the perfect destination for your adventure.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map((dest) => (
                            <div key={dest.name} className="glass rounded-2xl overflow-hidden group hover:border-accent-400/20 transition-all">
                                <div className="h-48 bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center">
                                    <span className="text-5xl">🏔️</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-heading font-semibold mb-1">{dest.name}</h3>
                                    <p className="text-accent-400 text-sm font-medium mb-3">{dest.tagline}</p>
                                    <p className="text-slate-400 text-sm">{dest.highlights}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Add destination images, detailed pages,
                            interactive map, and link to relevant experts.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
