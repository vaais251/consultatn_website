import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Content Hub — GB Guide Admin",
};

export default async function ContentHubPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    const cards = [
        {
            title: "Destinations",
            description: "Manage travel destinations — create, edit, publish, and organize destination guides.",
            href: "/admin/content/destinations",
            icon: "🏔️",
            count: null,
        },
        {
            title: "Blog Posts",
            description: "Write and manage blog articles — travel guides, tips, and stories from GB.",
            href: "/admin/content/blog",
            icon: "📰",
            count: null,
        },
    ];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">Content Hub</h1>
                <p className="text-slate-400">
                    Create and manage all content for the GB Guide platform.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="glass rounded-2xl p-6 hover:border-accent-400/30 transition-all group"
                    >
                        <div className="text-4xl mb-4">{card.icon}</div>
                        <h2 className="text-lg font-heading font-semibold group-hover:text-accent-400 transition-colors mb-2">
                            {card.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {card.description}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    );
}
