"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/app/lib/validations";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        coverImageUrl: "",
        content: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    });

    useEffect(() => {
        fetch(`/api/admin/blog/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    title: data.title || "",
                    slug: data.slug || "",
                    excerpt: data.excerpt || "",
                    coverImageUrl: data.coverImageUrl || "",
                    content: data.content || "",
                    status: data.status || "DRAFT",
                });
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load blog post");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to update blog post");
                setSaving(false);
                return;
            }

            router.push("/admin/content/blog");
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
                <div className="h-48 bg-white/5 rounded" />
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold mb-1">Edit Blog Post</h1>
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

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt</label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="admin-input resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image URL</label>
                    <input
                        type="url"
                        value={form.coverImageUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
                        className="admin-input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content <span className="text-slate-500 font-normal">Markdown supported</span>
                    </label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                        rows={20}
                        className="admin-input resize-y font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as typeof form.status }))}
                        className="admin-input"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
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
                        onClick={() => router.push("/admin/content/blog")}
                        className="btn-outline !py-2.5 !px-6 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
