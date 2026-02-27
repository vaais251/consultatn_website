"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Destination {
    id: string;
    title: string;
    slug: string;
    heroImageUrl: string | null;
    summary: string;
    region: string;
    difficulty: string | null;
    bestSeason: string | null;
}

export default function DestinationsClient({ destinations: initial }: { destinations: Destination[] }) {
    const [destinations] = useState(initial);
    const [regionFilter, setRegionFilter] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("");

    const regions = [...new Set(destinations.map((d) => d.region))].sort();
    const difficulties = [...new Set(destinations.map((d) => d.difficulty).filter(Boolean))].sort();

    const filtered = destinations.filter((d) => {
        if (regionFilter && d.region !== regionFilter) return false;
        if (difficultyFilter && d.difficulty !== difficultyFilter) return false;
        return true;
    });

    const difficultyColor: Record<string, string> = {
        EASY: "bg-emerald-500/20 text-emerald-400",
        MODERATE: "bg-accent-500/20 text-accent-400",
        HARD: "bg-red-500/20 text-red-400",
    };

    return (
        <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-accent-400/50 transition-colors"
                >
                    <option value="">All Regions</option>
                    {regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-accent-400/50 transition-colors"
                >
                    <option value="">All Difficulties</option>
                    {difficulties.map((d) => (
                        <option key={d!} value={d!}>{d}</option>
                    ))}
                </select>
                {(regionFilter || difficultyFilter) && (
                    <button
                        onClick={() => { setRegionFilter(""); setDifficultyFilter(""); }}
                        className="text-sm text-slate-400 hover:text-accent-400 transition-colors"
                    >
                        Clear filters
                    </button>
                )}
                <span className="text-sm text-slate-500 ml-auto">
                    {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-slate-400">No destinations match your filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((dest) => (
                        <Link
                            key={dest.id}
                            href={`/destinations/${dest.slug}`}
                            className="glass rounded-2xl overflow-hidden group hover:border-accent-400/20 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="h-48 relative overflow-hidden">
                                {dest.heroImageUrl ? (
                                    <img
                                        src={dest.heroImageUrl}
                                        alt={dest.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center">
                                        <span className="text-5xl">🏔️</span>
                                    </div>
                                )}
                                {dest.difficulty && (
                                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${difficultyColor[dest.difficulty] || "bg-slate-500/20 text-slate-400"}`}>
                                        {dest.difficulty}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-heading font-semibold mb-1 group-hover:text-accent-400 transition-colors">
                                    {dest.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                                    <span>📍 {dest.region}</span>
                                    {dest.bestSeason && <span>🗓️ {dest.bestSeason}</span>}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                    {dest.summary}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
