import Link from "next/link";

const footerSections = [
    {
        title: "Explore",
        links: [
            { label: "Destinations", href: "/destinations" },
            { label: "Services & Pricing", href: "/services" },
            { label: "Travel Blog", href: "/blog" },
            { label: "About Us", href: "/about" },
        ],
    },
    {
        title: "Travel Info",
        links: [
            { label: "Visa & Logistics", href: "/visa" },
            { label: "Culture & Preparation", href: "/preparation" },
            { label: "Contact & FAQ", href: "/contact" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Log In / Register", href: "/login" },
            { label: "Client Dashboard", href: "/dashboard" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)]" style={{ background: "var(--footer-bg)" }}>
            <div className="page-container section-padding !pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-lg font-heading transition-transform group-hover:scale-110">
                                NR
                            </div>
                            <span className="text-xl font-heading font-bold" style={{ color: "var(--footer-heading)" }}>
                                the<span className="text-accent-400">north</span>route
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--footer-text)" }}>
                            Connecting travelers worldwide with trusted local experts from
                            Gilgit-Baltistan. Plan your dream trip with confidence.
                        </p>
                        <div className="flex gap-3 mt-5">
                            {["Twitter", "Instagram", "YouTube"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:text-accent-400"
                                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--footer-text)" }}
                                    aria-label={social}
                                >
                                    {social[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "var(--footer-heading)" }}>
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm transition-colors hover:text-accent-400" style={{ color: "var(--footer-text)" }}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-sm" style={{ color: "var(--footer-text)" }}>
                        © {new Date().getFullYear()} The North Route. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {[
                            { label: "Privacy Policy", href: "/privacy" },
                            { label: "Terms of Service", href: "/terms" },
                            { label: "Refund Policy", href: "/refund-policy" },
                        ].map((link) => (
                            <Link key={link.href} href={link.href} className="transition-colors hover:text-accent-400" style={{ color: "var(--footer-text)" }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
