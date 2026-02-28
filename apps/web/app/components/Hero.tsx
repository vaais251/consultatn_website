"use client";

import { ReactNode } from "react";

/* ─── Hero Section ───────────────────────────────────────
   Full-bleed hero with background image, gradient overlay,
   staggered text animation, and optional trust chips.
   ─────────────────────────────────────────────────────── */

interface HeroProps {
    backgroundImage: string;
    title: ReactNode;
    subtitle?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    badges?: string[];
    /** 0.3 = light overlay, 0.7 = heavy dark overlay */
    overlayStrength?: number;
    /** CSS object-position for the background image */
    imagePosition?: string;
    /** Compact hero (e.g. for inner pages) */
    compact?: boolean;
}

export default function Hero({
    backgroundImage,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    badges,
    overlayStrength = 0.55,
    imagePosition = "center",
    compact = false,
}: HeroProps) {
    return (
        <section
            className={`relative overflow-hidden flex items-center ${compact ? "min-h-[45vh]" : "min-h-[90vh]"
                }`}
        >
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ objectPosition: imagePosition }}
                    loading="eager"
                />
            </div>

            {/* Dark gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to bottom, rgba(8,10,24,${overlayStrength}) 0%, rgba(8,10,24,${overlayStrength + 0.15}) 100%)`,
                }}
            />

            {/* Subtle grain/noise */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />

            {/* Floating atmosphere */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-accent-500/8 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 page-container py-20">
                <div className="max-w-3xl">
                    {/* Title */}
                    <h1
                        className={`font-heading font-bold leading-[1.08] mb-6 text-white animate-fade-in-up ${compact
                                ? "text-3xl md:text-4xl lg:text-5xl"
                                : "text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                            }`}
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl animate-fade-in-up-delay">
                            {subtitle}
                        </p>
                    )}

                    {/* CTAs */}
                    {(primaryCta || secondaryCta) && (
                        <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
                            {primaryCta && (
                                <a href={primaryCta.href} className="btn-accent !py-4 !px-8 text-base">
                                    {primaryCta.label}
                                </a>
                            )}
                            {secondaryCta && (
                                <a
                                    href={secondaryCta.href}
                                    className="btn-outline !py-4 !px-8 text-base !text-white !border-white/20 hover:!border-accent-400 hover:!text-accent-400"
                                >
                                    {secondaryCta.label}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Trust badges */}
                    {badges && badges.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up-delay-2">
                            {badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/10"
                                >
                                    ✓ {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
