"use client";

import { useState } from "react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
            _hp: (form.elements.namedItem("_hp") as HTMLInputElement).value,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                setSuccess(true);
                form.reset();
            } else {
                setError(result.error?.message || "Failed to send message");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-heading font-semibold mb-6">Send a Message</h2>

            {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    ✅ Thank you! We&apos;ll get back to you soon.
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="contact-name" className="text-sm text-slate-400 block mb-1">Your Name</label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="text-sm text-slate-400 block mb-1">Email</label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors"
                    />
                </div>
                <div>
                    <label htmlFor="contact-message" className="text-sm text-slate-400 block mb-1">Message</label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        required
                        minLength={10}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-accent-400/50 transition-colors resize-none"
                    />
                </div>

                {/* Honeypot — hidden from real users, bots will fill it */}
                <input
                    type="text"
                    name="_hp"
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-accent w-full disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
}
