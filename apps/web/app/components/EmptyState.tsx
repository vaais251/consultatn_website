import Link from "next/link";

interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionHref?: string;
}

/**
 * Premium empty state for list pages when no data is available.
 */
export default function EmptyState({ icon = "📭", title, subtitle, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-heading font-semibold mb-2">{title}</h3>
            {subtitle && <p className="text-slate-400 text-sm mb-6">{subtitle}</p>}
            {actionLabel && actionHref && (
                <Link href={actionHref} className="btn-accent text-sm">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
