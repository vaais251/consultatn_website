"use client";

import { useState } from "react";

export default function PayNowButton({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePay = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();

            if (res.ok && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                setError(data.error || "Failed to create checkout session");
                setLoading(false);
            }
        } catch {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handlePay}
                disabled={loading}
                className="btn-accent text-sm disabled:opacity-50"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirecting to Stripe...
                    </span>
                ) : (
                    "💳 Pay Now — Secure Checkout"
                )}
            </button>
            {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
        </div>
    );
}
