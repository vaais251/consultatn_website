"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/app/lib/validations";

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        fetch(`/api/admin/destinations/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    title: data.title || "",
                    slug: data.slug || "",
                    heroImageUrl: data.heroImageUrl || "",
                    summary: data.summary || "",
                    content: data.content || "",
                    region: data.region || "",
                    difficulty: data.difficulty || "",
                    bestSeason: data.bestSeason || "",
                    isPublished: data.isPublished || false,
                });
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load destination");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/destinations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to update destination");
                setSaving(false);
                return;
            }

            router.push("/admin/content/destinations");
        } catch {
            setError("Network error. Please try again.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 max-w-3xl animate-pulse">
                <div className="h-8 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-12 bg-white/5 rounded mt-8" />
                <div className="h-12 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded" />
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold mb-1">Edit Destination</h1>
                <p className="text-slate-400 text-sm">Update &ldquo;{form.title}&rdquo;</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        required
                        className="admin-input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Slug *</label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                        required
                        className="admin-input font-mono text-sm"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Region *</label>
                        <input
                            type="text"
                            value={form.region}
                            onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
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

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Best Season</label>
                        <input
                            type="text"
                            value={form.bestSeason}
                            onChange={(e) => setForm((prev) => ({ ...prev, bestSeason: e.target.value }))}
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image URL</label>
                        <input
                            type="url"
                            value={form.heroImageUrl}
                            onChange={(e) => setForm((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                            className="admin-input"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Summary *</label>
                    <textarea
                        value={form.summary}
                        onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                        rows={3}
                        required
                        className="admin-input resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content * <span className="text-slate-500 font-normal">Markdown supported</span>
                    </label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                        rows={16}
                        required
                        className="admin-input resize-y font-mono text-sm"
                    />
                </div>

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

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-accent !py-2.5 !px-6 text-sm disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
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
