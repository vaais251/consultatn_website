import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import DestinationsClient from "./DestinationsClient";

export const metadata: Metadata = {
    title: "Destinations — GB Guide",
    description: "Explore stunning destinations across Gilgit-Baltistan: Hunza Valley, Skardu, Fairy Meadows, Naltar, K2 Base Camp, and more.",
    openGraph: {
        title: "Destinations — GB Guide",
        description: "Explore stunning destinations across Gilgit-Baltistan.",
    },
};

export default async function DestinationsPage() {
    const destinations = await prisma.destination.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            heroImageUrl: true,
            summary: true,
            region: true,
            difficulty: true,
            bestSeason: true,
        },
    });

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
                    <DestinationsClient destinations={destinations} />
                </div>
            </section>
        </>
    );
}
