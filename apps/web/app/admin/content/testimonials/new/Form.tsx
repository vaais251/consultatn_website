"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    testimonial?: {
        id: string;
        name: string;
        country: string;
        quote: string;
        rating: number;
        tripType: string | null;
        isPublished: boolean;
    };
}

export default function TestimonialForm({ testimonial }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            country: (form.elements.namedItem("country") as HTMLInputElement).value,
            quote: (form.elements.namedItem("quote") as HTMLTextAreaElement).value,
            rating: parseInt((form.elements.namedItem("rating") as HTMLSelectElement).value),
            tripType: (form.elements.namedItem("tripType") as HTMLInputElement).value || undefined,
            isPublished: (form.elements.namedItem("isPublished") as HTMLInputElement).checked,
        };

        const url = testimonial
            ? `/api/admin/testimonials/${testimonial.id}`
            : "/api/admin/testimonials";
        const method = testimonial ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/admin/content/testimonials");
                router.refresh();
            } else {
                const result = await res.json();
                setError(result.error?.message || "Failed to save");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-2xl space-y-5">
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm text-slate-400 block mb-1">Name *</label>
                <input name="name" defaultValue={testimonial?.name} required className="admin-input" placeholder="Sarah Mitchell" />
            </div>

            <div>
                <label className="text-sm text-slate-400 block mb-1">Country *</label>
                <input name="country" defaultValue={testimonial?.country} required className="admin-input" placeholder="United States" />
            </div>

            <div>
                <label className="text-sm text-slate-400 block mb-1">Quote *</label>
                <textarea name="quote" defaultValue={testimonial?.quote} required rows={4} className="admin-input" placeholder="Their experience..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-slate-400 block mb-1">Rating</label>
                    <select name="rating" defaultValue={testimonial?.rating ?? 5} className="admin-input">
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>{"★".repeat(r)}{"☆".repeat(5 - r)} ({r})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-1">Trip Type</label>
                    <input name="tripType" defaultValue={testimonial?.tripType ?? ""} className="admin-input" placeholder="Hunza trek" />
                </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isPublished" defaultChecked={testimonial?.isPublished ?? false} className="w-4 h-4 rounded accent-accent-400" />
                <span className="text-sm text-slate-300">Publish immediately</span>
            </label>

            <button type="submit" disabled={loading} className="btn-accent disabled:opacity-50">
                {loading ? "Saving..." : testimonial ? "Update Testimonial" : "Create Testimonial"}
            </button>
        </form>
    );
}
