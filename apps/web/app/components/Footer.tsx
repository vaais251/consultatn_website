import Link from "next/link";

const footerSections = [
    {
        title: "Explore",
        links: [
            { label: "Destinations", href: "/destinations" },
            { label: "Services & Pricing", href: "/services" },
            { label: "Travel Blog", href: "/blog" },
            { label: "About & Experts", href: "/about" },
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
        <footer className="border-t border-white/10 bg-navy-950/80">
            <div className="page-container section-padding !pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-lg font-heading transition-transform group-hover:scale-110">
                                GB
                            </div>
                            <span className="text-xl font-heading font-bold text-white">
                                GB <span className="text-accent-400">Guide</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Connecting travelers worldwide with trusted local experts from
                            Gilgit-Baltistan. Plan your dream trip with confidence.
                        </p>
                        {/* Social placeholders */}
                        <div className="flex gap-3 mt-5">
                            {["Twitter", "Instagram", "YouTube"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-accent-400 hover:bg-white/10 transition-all text-xs font-bold"
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
                            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-accent-400 text-sm transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} GB Guide. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link
                            href="/privacy"
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
