/**
 * Verified badge for expert profiles.
 */
export default function VerifiedBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
    if (size === "lg") {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-400 text-sm font-medium">Verified Local Expert</span>
            </div>
        );
    }

    return (
        <span
            className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium"
            title="Verified identity and local expertise by GB Guide"
        >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
        </span>
    );
}
