"use client";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="glass rounded-2xl p-10 max-w-md text-center">
                <div className="text-5xl mb-4">😞</div>
                <h2 className="text-xl font-heading font-bold mb-3">
                    Dashboard Error
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {error.message || "Something went wrong loading your dashboard."}
                </p>
                <button onClick={reset} className="btn-primary text-sm">
                    Retry
                </button>
            </div>
        </div>
    );
}
