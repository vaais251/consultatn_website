"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="glass rounded-2xl p-10 max-w-md text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-heading font-bold mb-3">
                    Something went wrong
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
                <button onClick={reset} className="btn-accent text-sm">
                    Try Again
                </button>
            </div>
        </div>
    );
}
