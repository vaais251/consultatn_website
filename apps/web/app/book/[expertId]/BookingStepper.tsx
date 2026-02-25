"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Slot {
    id: string;
    startAt: string;
    endAt: string;
}

interface Props {
    expertId: string;
    expertName: string;
    specialty: string;
    region: string;
    hourlyRate: number;
}

export default function BookingStepper({ expertId, expertName, specialty, region, hourlyRate }: Props) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Pre-consultation form
    const [nationality, setNationality] = useState("");
    const [travelDates, setTravelDates] = useState("");
    const [interests, setInterests] = useState("");
    const [questions, setQuestions] = useState("");

    useEffect(() => {
        fetch(`/api/slots?expertUserId=${expertId}`)
            .then((r) => r.json())
            .then((data) => {
                setSlots(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [expertId]);

    // Group slots by date (local timezone)
    const grouped: Record<string, Slot[]> = {};
    slots.forEach((s) => {
        const date = new Date(s.startAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(s);
    });

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const handleSubmit = async () => {
        if (!selectedSlot) return;
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expertId,
                    slotId: selectedSlot.id,
                    nationality,
                    travelDates,
                    interests,
                    questions,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                router.push(`/dashboard/bookings/${data.id}?new=1`);
            } else {
                setError(data.error || "Failed to create booking");
                if (res.status === 409) setStep(1); // Go back to slot selection
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid =
        nationality.length >= 2 &&
        travelDates.length >= 3 &&
        interests.length >= 5 &&
        questions.length >= 5;

    const stepLabels = ["Select Time", "Pre-Consultation", "Confirm"];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-accent-400/10 text-accent-400 text-xs font-semibold tracking-wider uppercase mb-3">
                    Book Consultation
                </span>
                <h1 className="text-3xl font-heading font-bold mb-1">
                    Book <span className="gradient-text">{expertName}</span>
                </h1>
                <p className="text-slate-400">
                    {specialty} · {region} · ${hourlyRate}/session
                </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8">
                {stepLabels.map((label, i) => (
                    <div key={label} className="flex items-center gap-2 flex-1">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step > i + 1
                                    ? "bg-emerald-500 text-white"
                                    : step === i + 1
                                        ? "bg-accent-400 text-navy-950"
                                        : "bg-white/10 text-slate-500"
                                }`}
                        >
                            {step > i + 1 ? "✓" : i + 1}
                        </div>
                        <span className={`text-sm hidden sm:block ${step === i + 1 ? "text-white" : "text-slate-500"}`}>
                            {label}
                        </span>
                        {i < stepLabels.length - 1 && (
                            <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-emerald-500/50" : "bg-white/10"}`} />
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Step 1: Slot Selection */}
            {step === 1 && (
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-heading font-semibold mb-2">Choose a Time Slot</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Showing available slots for the next 14 days. Times shown in your local timezone.
                    </p>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-accent-400/30 border-t-accent-400 rounded-full mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">Loading availability...</p>
                        </div>
                    ) : Object.keys(grouped).length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">😔</div>
                            <p className="text-slate-400">No slots available in the next 14 days.</p>
                            <p className="text-slate-500 text-sm mt-1">Please check back later or try another expert.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(grouped).map(([dateLabel, daySlots]) => (
                                <div key={dateLabel}>
                                    <h3 className="text-sm font-medium text-accent-400 mb-3">{dateLabel}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {daySlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedSlot?.id === slot.id
                                                        ? "bg-accent-400 text-navy-950 shadow-lg shadow-accent-400/25"
                                                        : "bg-white/5 border border-white/10 text-slate-300 hover:border-accent-400/30 hover:text-white"
                                                    }`}
                                            >
                                                {formatTime(slot.startAt)} – {formatTime(slot.endAt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedSlot}
                            className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Pre-Consultation Form */}
            {step === 2 && (
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-heading font-semibold mb-2">Pre-Consultation Form</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Help your expert prepare the best possible advice for your Gilgit-Baltistan trip.
                    </p>

                    <div className="space-y-5">
                        <div>
                            <label className="text-sm text-slate-400 block mb-1.5">
                                Nationality <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                placeholder="e.g., American, British, Chinese"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1.5">
                                Intended Travel Dates <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={travelDates}
                                onChange={(e) => setTravelDates(e.target.value)}
                                placeholder="e.g., June 15 – June 28, 2026"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1.5">
                                Interests <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                rows={3}
                                placeholder="What are you most excited about? Trekking, culture, food, photography, family-friendly activities..."
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1.5">
                                Specific Questions <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={questions}
                                onChange={(e) => setQuestions(e.target.value)}
                                rows={3}
                                placeholder="Any specific questions for the expert? Visa requirements, best routes, accommodation tips..."
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setStep(1)} className="btn-outline">
                            ← Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!isFormValid}
                            className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Review Booking
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && selectedSlot && (
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-heading font-semibold mb-2">Confirm Your Booking</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Review the details below and confirm to create your booking.
                    </p>

                    <div className="space-y-4 mb-8">
                        {/* Expert */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-lg shrink-0">
                                {expertName.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <div>
                                <p className="font-medium">{expertName}</p>
                                <p className="text-slate-400 text-sm">{specialty} · {region}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-accent-400 font-bold text-lg">${hourlyRate}</p>
                                <p className="text-slate-500 text-xs">per session</p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Date & Time</p>
                            <p className="text-white font-medium">
                                {new Date(selectedSlot.startAt).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-slate-300 text-sm">
                                {formatTime(selectedSlot.startAt)} – {formatTime(selectedSlot.endAt)}
                            </p>
                        </div>

                        {/* Form Summary */}
                        <div className="p-4 rounded-xl bg-white/5 space-y-2">
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Pre-Consultation Info</p>
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-slate-500">Nationality:</span>{" "}
                                    <span className="text-white">{nationality}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Travel dates:</span>{" "}
                                    <span className="text-white">{travelDates}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-500">Interests:</span>{" "}
                                <span className="text-slate-300">{interests}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-500">Questions:</span>{" "}
                                <span className="text-slate-300">{questions}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent-400/10 border border-accent-400/20 text-sm text-slate-300 mb-6">
                        💡 After confirming, your booking status will be <strong>Pending Payment</strong>.
                        Payment integration is coming soon — your slot is reserved.
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => setStep(2)} className="btn-outline">
                            ← Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-accent disabled:opacity-50"
                        >
                            {submitting ? "Creating Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
