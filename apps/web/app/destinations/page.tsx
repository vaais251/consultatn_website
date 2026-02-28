import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import Hero from "@/app/components/Hero";
import DestinationsClient from "./DestinationsClient";
import { images } from "@/app/config/images";

export const metadata: Metadata = {
    title: "Destinations — The North Route",
    description: "Explore stunning destinations across Gilgit-Baltistan: Hunza Valley, Skardu, Fairy Meadows, Naltar, K2 Base Camp, and more.",
    openGraph: {
        title: "Destinations — The North Route",
        description: "Explore stunning destinations across Gilgit-Baltistan.",
    },
};

export default async function DestinationsPage() {
    const destinations = await prisma.destination.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: {
            id: true, title: true, slug: true, heroImageUrl: true,
            summary: true, region: true, difficulty: true, bestSeason: true,
        },
    });

    return (
        <>
            <Hero
                backgroundImage={images.destinationsHero}
                compact
                title={<>Discover <span className="gradient-text">Destinations</span></>}
                subtitle="From the soaring peaks of K2 to the serene terraces of Hunza — find the perfect destination for your adventure."
            />

            <section className="section-padding" style={{ background: "var(--bg)" }}>
                <div className="page-container">
                    <DestinationsClient destinations={destinations} />
                </div>
            </section>
        </>
    );
}
