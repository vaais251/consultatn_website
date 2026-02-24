"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    userId: string;
    initialData: {
        name: string;
        country: string;
        whatsappNumber: string;
        travelPreferences: string;
    };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [form, setForm] = useState(initialData);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setMessage("Profile updated successfully!");
                setIsEditing(false);
                router.refresh();
            } else {
                const data = await res.json();
                setMessage(data.error || "Failed to update profile");
            }
        } catch {
            setMessage("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isEditing) {
        return (
            <div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">Full Name</label>
                        <p className="text-white mt-1">{form.name || "—"}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">Country</label>
                        <p className="text-white mt-1">{form.country || "—"}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                        <p className="text-white mt-1">{form.whatsappNumber || "Not set"}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider">Travel Preferences</label>
                        <p className="text-white mt-1">{form.travelPreferences || "Not set"}</p>
                    </div>
                </div>
                {message && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        {message}
                    </div>
                )}
                <button onClick={() => setIsEditing(true)} className="btn-primary text-sm">
                    Edit Profile
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-slate-400 block mb-1">Full Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-1">Country</label>
                    <input
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-1">WhatsApp Number</label>
                    <input
                        type="text"
                        value={form.whatsappNumber}
                        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-1">Travel Preferences</label>
                    <input
                        type="text"
                        value={form.travelPreferences}
                        onChange={(e) => setForm({ ...form, travelPreferences: e.target.value })}
                        placeholder="e.g., Trekking, Photography, Family trips"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
            </div>

            {message && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    {message}
                </div>
            )}

            <div className="flex gap-3">
                <button type="submit" disabled={isSaving} className="btn-accent text-sm disabled:opacity-50">
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setForm(initialData);
                    }}
                    className="btn-outline text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
