"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    author?: { name: string } | null;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/blog")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

        const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
        if (res.ok) {
            setPosts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const statusColors: Record<string, string> = {
        PUBLISHED: "bg-emerald-500/20 text-emerald-400",
        DRAFT: "bg-slate-500/20 text-slate-400",
        ARCHIVED: "bg-orange-500/20 text-orange-400",
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold mb-1">Blog Posts</h1>
                    <p className="text-slate-400 text-sm">
                        {posts.length} post{posts.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/admin/content/blog/new" className="btn-accent text-sm !py-2.5 !px-5">
                    + New Post
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
            ) : posts.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-4xl mb-4">📰</p>
                    <p className="text-slate-400 mb-4">No blog posts yet.</p>
                    <Link href="/admin/content/blog/new" className="btn-primary text-sm">
                        Write Your First Post
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="glass rounded-xl p-4 flex items-center justify-between group hover:border-accent-400/20 transition-all"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-heading font-semibold truncate">
                                        {post.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[post.status] || statusColors.DRAFT}`}>
                                        {post.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span>/{post.slug}</span>
                                    {post.author && <span>by {post.author.name}</span>}
                                    {post.publishedAt && (
                                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <Link
                                    href={`/admin/content/blog/${post.id}/edit`}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id, post.title)}
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
