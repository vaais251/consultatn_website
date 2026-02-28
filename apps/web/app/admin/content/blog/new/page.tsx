"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/app/lib/validations";

export default function NewBlogPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        coverImageUrl: "",
        content: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
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
            const res = await fetch("/api/admin/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to create blog post");
                setLoading(false);
                return;
            }

            router.push("/admin/content/blog");
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold mb-1">New Blog Post</h1>
                <p className="text-slate-400 text-sm">Write a new article for the The North Route blog.</p>
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
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., First Timer's Guide to Hunza"
                        required
                        className="admin-input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Slug * <span className="text-slate-500 font-normal ml-2">Auto-generated</span>
                    </label>
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
                        placeholder="A brief summary shown on the blog listing..."
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
                        placeholder="https://..."
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
                        placeholder="## Introduction&#10;&#10;Write your blog post here..."
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
                        disabled={loading}
                        className="btn-accent !py-2.5 !px-6 text-sm disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Post"}
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
