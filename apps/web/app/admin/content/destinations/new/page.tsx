"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/app/lib/validations";

export default function NewDestinationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        slug: "",
        heroImageUrl: "",
        summary: "",
        content: "",
        region: "",
        difficulty: "",
        bestSeason: "",
        isPublished: false,
    });

    const handleTitleChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            title: value,
            slug: prev.slug === slugify(prev.title) || !prev.slug ? slugify(value) : prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/destinations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to create destination");
                setLoading(false);
                return;
            }

            router.push("/admin/content/destinations");
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold mb-1">New Destination</h1>
                <p className="text-slate-400 text-sm">Create a new travel destination guide.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., Hunza Valley"
                        required
                        className="admin-input"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Slug *
                        <span className="text-slate-500 font-normal ml-2">Auto-generated from title</span>
                    </label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                        placeholder="hunza-valley"
                        required
                        className="admin-input font-mono text-sm"
                    />
                </div>

                {/* Region + Difficulty */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Region *</label>
                        <input
                            type="text"
                            value={form.region}
                            onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                            placeholder="e.g., Hunza, Skardu, Diamer"
                            required
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
                            className="admin-input"
                        >
                            <option value="">Select difficulty</option>
                            <option value="EASY">Easy</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Best Season + Hero Image */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Best Season</label>
                        <input
                            type="text"
                            value={form.bestSeason}
                            onChange={(e) => setForm((prev) => ({ ...prev, bestSeason: e.target.value }))}
                            placeholder="e.g., May – October"
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image URL</label>
                        <input
                            type="url"
                            value={form.heroImageUrl}
                            onChange={(e) => setForm((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                            placeholder="https://..."
                            className="admin-input"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Summary *</label>
                    <textarea
                        value={form.summary}
                        onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                        placeholder="A brief description shown on cards..."
                        rows={3}
                        required
                        className="admin-input resize-none"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content * <span className="text-slate-500 font-normal">Markdown supported</span>
                    </label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                        placeholder="## Overview&#10;&#10;Write your destination guide here..."
                        rows={16}
                        required
                        className="admin-input resize-y font-mono text-sm"
                    />
                </div>

                {/* Publish toggle */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.isPublished ? "bg-emerald-500" : "bg-white/10"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-6" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                    <span className="text-sm text-slate-300">
                        {form.isPublished ? "Published — visible on site" : "Draft — not visible on site"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-accent !py-2.5 !px-6 text-sm disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Destination"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/content/destinations")}
                        className="btn-outline !py-2.5 !px-6 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
