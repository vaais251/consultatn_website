"use client";

import { useState, useEffect, useCallback } from "react";

interface Expert {
    profileId: string;
    userId: string;
    name: string;
    isActive: boolean;
}

interface Slot {
    id: string;
    startAt: string;
    endAt: string;
    status: string;
    booking?: { id: string; status: string } | null;
}

export default function AvailabilityManager({ experts }: { experts: Expert[] }) {
    const [selectedExpert, setSelectedExpert] = useState(experts[0]?.profileId || "");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Slot creation form
    const [date, setDate] = useState("");
    const [startHour, setStartHour] = useState(9);
    const [startMinute, setStartMinute] = useState(0);
    const [duration, setDuration] = useState(60);

    const fetchSlots = useCallback(async () => {
        if (!selectedExpert) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/slots?expertProfileId=${selectedExpert}`);
            if (res.ok) setSlots(await res.json());
        } catch {
            console.error("Failed to fetch slots");
        } finally {
            setLoading(false);
        }
    }, [selectedExpert]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const createSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await fetch("/api/admin/slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expertProfileId: selectedExpert,
                    date,
                    startHour,
                    startMinute,
                    durationMinutes: duration,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Slot created!");
                fetchSlots();
            } else {
                setMessage(data.error || "Failed to create slot");
            }
        } catch {
            setMessage("Something went wrong");
        }
    };

    const toggleBlock = async (slotId: string, currentStatus: string) => {
        const newStatus = currentStatus === "BLOCKED" ? "AVAILABLE" : "BLOCKED";
        try {
            const res = await fetch("/api/admin/slots", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slotId, status: newStatus }),
            });
            if (res.ok) fetchSlots();
        } catch {
            console.error("Failed to update slot");
        }
    };

    const deleteSlot = async (slotId: string) => {
        try {
            const res = await fetch(`/api/admin/slots?slotId=${slotId}`, { method: "DELETE" });
            if (res.ok) fetchSlots();
        } catch {
            console.error("Failed to delete slot");
        }
    };

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    // Group slots by date
    const grouped: Record<string, Slot[]> = {};
    slots.forEach((s) => {
        const key = formatDate(s.startAt);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
    });

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-8">
            {/* Expert Selector */}
            <div className="glass rounded-2xl p-6">
                <label className="text-sm text-slate-400 block mb-2">Select Expert</label>
                <select
                    value={selectedExpert}
                    onChange={(e) => setSelectedExpert(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50 transition-colors"
                >
                    {experts.map((ex) => (
                        <option key={ex.profileId} value={ex.profileId} className="bg-navy-950">
                            {ex.name} {!ex.isActive && "(Inactive)"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Create Slot Form */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Create New Slot</h2>
                <form onSubmit={createSlot} className="grid sm:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Date</label>
                        <input
                            type="date"
                            required
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Start Hour (UTC)</label>
                        <select
                            value={startHour}
                            onChange={(e) => setStartHour(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i} className="bg-navy-950">
                                    {String(i).padStart(2, "0")}:00
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Minute</label>
                        <select
                            value={startMinute}
                            onChange={(e) => setStartMinute(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50"
                        >
                            <option value={0} className="bg-navy-950">:00</option>
                            <option value={30} className="bg-navy-950">:30</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Duration</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/50"
                        >
                            <option value={30} className="bg-navy-950">30 min</option>
                            <option value={60} className="bg-navy-950">60 min</option>
                            <option value={90} className="bg-navy-950">90 min</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-accent text-sm !py-2.5">
                        + Add Slot
                    </button>
                </form>
                {message && (
                    <p className={`mt-3 text-sm ${message.includes("created") ? "text-emerald-400" : "text-red-400"}`}>
                        {message}
                    </p>
                )}
            </div>

            {/* Slots List */}
            <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-heading font-semibold mb-4">
                    Upcoming Slots ({slots.length})
                </h2>

                {loading ? (
                    <p className="text-slate-500 text-sm">Loading...</p>
                ) : Object.keys(grouped).length === 0 ? (
                    <p className="text-slate-500 text-sm">No upcoming slots. Create one above.</p>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([dateLabel, daySlots]) => (
                            <div key={dateLabel}>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">{dateLabel}</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {daySlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl border ${slot.status === "BOOKED"
                                                    ? "bg-primary-600/10 border-primary-500/30"
                                                    : slot.status === "BLOCKED"
                                                        ? "bg-red-500/10 border-red-500/30"
                                                        : "bg-white/5 border-white/10"
                                                }`}
                                        >
                                            <div>
                                                <span className="text-white text-sm font-medium">
                                                    {formatTime(slot.startAt)} – {formatTime(slot.endAt)}
                                                </span>
                                                <span
                                                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${slot.status === "AVAILABLE"
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : slot.status === "BOOKED"
                                                                ? "bg-primary-500/20 text-primary-400"
                                                                : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >
                                                    {slot.status}
                                                </span>
                                            </div>
                                            {slot.status !== "BOOKED" && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => toggleBlock(slot.id, slot.status)}
                                                        className="px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                                                        title={slot.status === "BLOCKED" ? "Unblock" : "Block"}
                                                    >
                                                        {slot.status === "BLOCKED" ? "Unblock" : "Block"}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSlot(slot.id)}
                                                        className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
