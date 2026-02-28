"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Netherlands", "Japan", "South Korea", "China",
    "India", "Pakistan", "UAE", "Saudi Arabia", "Turkey",
    "Malaysia", "Singapore", "Thailand", "Indonesia", "Brazil",
    "Other",
];

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        country: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setIsLoading(false);
                return;
            }

            // Auto sign-in after successful registration
            const signInResult = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Registration succeeded but auto-login failed → redirect to login
                router.push("/login?registered=true");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <section className="min-h-[85vh] flex items-center justify-center section-padding" style={{ background: "var(--bg)" }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-xl font-heading transition-transform group-hover:scale-110">
                            NR
                        </div>
                    </Link>
                    <h1 className="text-3xl font-heading font-bold mb-2">Create Your Account</h1>
                    <p className="text-[var(--text-muted)]">Join thousands of travelers planning their northern adventure</p>
                </div>

                <div className="rounded-2xl p-8 border border-[var(--border)]" style={{ background: "var(--surface)", boxShadow: "var(--shadow-md)" }}>
                    {/* Google OAuth */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] hover:border-accent-400/30 transition-colors mb-6"
                        style={{ background: "var(--bg)" }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border)]" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 text-[var(--text-muted)]" style={{ background: "var(--surface)" }}>or register with email</span>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Your full name"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-400/50 transition-colors"
                                style={{ background: "var(--bg)", color: "var(--text)" }}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-1">Country</label>
                            <select
                                required
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-accent-400/50 transition-colors appearance-none"
                                style={{ background: "var(--bg)", color: "var(--text)" }}
                            >
                                <option value="" className="bg-navy-950">Select your country</option>
                                {countries.map((c) => (
                                    <option key={c} value={c} className="bg-navy-950">{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-400/50 transition-colors"
                                style={{ background: "var(--bg)", color: "var(--text)" }}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-400/50 transition-colors"
                                style={{ background: "var(--bg)", color: "var(--text)" }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-[var(--text-muted)] text-sm text-center mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-accent-400 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-6 mt-6 text-slate-500 text-xs">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure registration
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        No card details stored
                    </div>
                </div>
            </div>
        </section>
    );
}
