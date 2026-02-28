"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelButton({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Client requested cancellation" }),
            });

            const data = await res.json();

            if (res.ok) {
                router.refresh();
            } else {
                setError(data.error?.message || "Failed to cancel booking");
                setShowConfirm(false);
            }
        } catch {
            setError("Something went wrong");
            setShowConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="space-y-3">
                <p className="text-amber-400 text-sm font-medium">
                    ⚠️ Are you sure you want to cancel this booking?
                </p>
                <p className="text-slate-400 text-xs">
                    Cancellations must be made at least 24 hours before the session.
                    Refund eligibility depends on timing.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Cancelling..." : "Yes, Cancel Booking"}
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                    >
                        Keep Booking
                    </button>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
                ✕ Cancel Booking
            </button>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    );
}
