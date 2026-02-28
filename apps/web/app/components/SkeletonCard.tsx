/**
 * Skeleton loading card with shimmer animation.
 * Use in expert/destination/blog grids while data loads.
 */
export function SkeletonCard() {
    return (
        <div className="glass rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-white/5" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                <div className="h-4 bg-white/5 rounded-lg w-full" />
                <div className="h-4 bg-white/5 rounded-lg w-5/6" />
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="glass rounded-xl p-4 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-white/5 rounded-lg" />
        </div>
    );
}
