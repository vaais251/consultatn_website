"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestimonialPublishToggle({ id, isPublished }: { id: string; isPublished: boolean }) {
    const [published, setPublished] = useState(isPublished);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggle = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !published }),
            });
            if (res.ok) {
                setPublished(!published);
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${published
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
        >
            {published ? "Published" : "Draft"}
        </button>
    );
}
