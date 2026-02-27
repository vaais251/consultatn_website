"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Destination {
    id: string;
    title: string;
    slug: string;
    region: string;
    difficulty: string | null;
    isPublished: boolean;
    createdAt: string;
}

export default function AdminDestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/destinations")
            .then((res) => res.json())
            .then((data) => {
                setDestinations(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

        const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
        if (res.ok) {
            setDestinations((prev) => prev.filter((d) => d.id !== id));
        }
    };

    const togglePublish = async (dest: Destination) => {
        const res = await fetch(`/api/admin/destinations/${dest.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: dest.title,
                slug: dest.slug,
                summary: "—",
                content: "—",
                region: dest.region,
                difficulty: dest.difficulty || "",
                isPublished: !dest.isPublished,
            }),
        });
        if (res.ok) {
            const updated = await res.json();
            setDestinations((prev) =>
                prev.map((d) => (d.id === updated.id ? { ...d, isPublished: updated.isPublished } : d))
            );
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold mb-1">Destinations</h1>
                    <p className="text-slate-400 text-sm">
                        {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/admin/content/destinations/new" className="btn-accent text-sm !py-2.5 !px-5">
                    + New Destination
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass rounded-xl p-4 animate-pulse">
                            <div className="h-5 bg-white/10 rounded w-1/3 mb-2" />
                            <div className="h-4 bg-white/5 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : destinations.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-4xl mb-4">🏔️</p>
                    <p className="text-slate-400 mb-4">No destinations yet.</p>
                    <Link href="/admin/content/destinations/new" className="btn-primary text-sm">
                        Create Your First Destination
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="glass rounded-xl p-4 flex items-center justify-between group hover:border-accent-400/20 transition-all"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-heading font-semibold truncate">
                                        {dest.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${dest.isPublished
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-slate-500/20 text-slate-400"
                                            }`}
                                    >
                                        {dest.isPublished ? "Published" : "Draft"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span>📍 {dest.region}</span>
                                    {dest.difficulty && <span>⛰️ {dest.difficulty}</span>}
                                    <span>/{dest.slug}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button
                                    onClick={() => togglePublish(dest)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                                >
                                    {dest.isPublished ? "Unpublish" : "Publish"}
                                </button>
                                <Link
                                    href={`/admin/content/destinations/${dest.id}/edit`}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(dest.id, dest.title)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
