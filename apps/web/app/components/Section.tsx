import { ReactNode } from "react";

/* ─── Section Wrapper ─────────────────────────────────── */
interface SectionProps {
    children: ReactNode;
    eyebrow?: string;
    title?: ReactNode;
    subtitle?: string;
    className?: string;
    centered?: boolean;
    id?: string;
}

export function Section({
    children,
    eyebrow,
    title,
    subtitle,
    className = "",
    centered = false,
    id,
}: SectionProps) {
    return (
        <section id={id} className={`section-padding ${className}`} style={{ background: "var(--bg)" }}>
            <div className="page-container">
                {(eyebrow || title || subtitle) && (
                    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
                        {eyebrow && (
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent-500 mb-3 block">
                                {eyebrow}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className={`text-[var(--text-muted)] max-w-2xl ${centered ? "mx-auto" : ""}`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}

/* ─── Trust Chips ─────────────────────────────────────── */
interface TrustChipsProps {
    items: { icon: string; label: string; value?: string }[];
}

export function TrustChips({ items }: TrustChipsProps) {
    return (
        <div className="py-6 border-y border-[var(--border)]" style={{ background: "var(--bg)" }}>
            <div className="page-container">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
                    {items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <span className="text-accent-500 font-bold text-lg">{item.icon}</span>
                            {item.value && <span className="text-accent-500 font-bold">{item.value}</span>}
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── CTA Section (full-bleed with bg image) ──────────── */
interface CTASectionProps {
    backgroundImage?: string;
    title: string;
    subtitle: string;
    cta: { label: string; href: string };
}

export function CTASection({ backgroundImage, title, subtitle, cta }: CTASectionProps) {
    return (
        <section className="section-padding" style={{ background: "var(--bg)" }}>
            <div className="page-container">
                <div className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                    {backgroundImage ? (
                        <>
                            <img
                                src={backgroundImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-navy-950/85 to-navy-950/70" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 to-primary-950/80" />
                    )}

                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
                            {title}
                        </h2>
                        <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
                            {subtitle}
                        </p>
                        <a href={cta.href} className="btn-accent !py-4 !px-10 text-lg">
                            {cta.label}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
