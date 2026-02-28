"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundButton({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleRefund = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/refund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setShowConfirm(false);
                router.refresh();
            } else {
                setError(data.error?.message || "Failed to issue refund");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                ✅ Refund issued successfully
            </div>
        );
    }

    if (showConfirm) {
        return (
            <div className="space-y-3">
                <p className="text-amber-400 text-sm font-medium">
                    ⚠️ Issue a full refund for this booking?
                </p>
                <p className="text-slate-400 text-xs">
                    This will refund the full amount via Stripe. This action cannot be undone.
                    In test mode, refunds are simulated.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefund}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Confirm Refund"}
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                    >
                        Cancel
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
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-colors"
            >
                💰 Issue Refund
            </button>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    );
}
