import { MetadataRoute } from "next";
import { prisma } from "@/app/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://thenorthroute.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        { url: `${BASE_URL}/`, changeFrequency: "weekly" as const, priority: 1.0 },
        { url: `${BASE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${BASE_URL}/services`, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${BASE_URL}/experts`, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${BASE_URL}/destinations`, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${BASE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${BASE_URL}/visa`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${BASE_URL}/preparation`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${BASE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
    ];

    // Dynamic destinations
    const destinations = await prisma.destination.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
    });

    const destinationPages = destinations.map((d) => ({
        url: `${BASE_URL}/destinations/${d.slug}`,
        lastModified: d.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Dynamic blog posts
    const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
    });

    const blogPages = posts.map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...destinationPages, ...blogPages];
}
