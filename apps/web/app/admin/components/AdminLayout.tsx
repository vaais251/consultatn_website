"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: "📊",
    },
    {
        label: "Content Hub",
        href: "/admin/content",
        icon: "📝",
    },
    {
        label: "Destinations",
        href: "/admin/content/destinations",
        icon: "🏔️",
    },
    {
        label: "Blog Posts",
        href: "/admin/content/blog",
        icon: "📰",
    },
    {
        label: "Availability",
        href: "/admin/availability",
        icon: "📅",
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-[calc(100vh-4.5rem)] flex">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-white/10 bg-navy-950/50 hidden lg:block">
                <div className="p-6">
                    <h2 className="text-xs font-bold text-accent-400 tracking-widest uppercase mb-6">
                        Admin Panel
                    </h2>
                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== "/admin" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-accent-400/10 text-accent-400 border border-accent-400/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="text-base">{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Admin info */}
                <div className="absolute bottom-8 left-0 w-64 px-6">
                    <div className="glass rounded-xl p-4 text-xs text-slate-500">
                        <p className="font-medium text-slate-400 mb-1">Admin CMS</p>
                        <p>Manage content, destinations, and blog posts.</p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-navy-950/30">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu hint */}
                        <div className="lg:hidden">
                            <span className="text-sm text-slate-400">☰ Menu</span>
                        </div>
                        <span className="text-sm text-slate-400 hidden lg:block">
                            Content Management System
                        </span>
                    </div>
                    <Link href="/" className="text-xs text-slate-500 hover:text-accent-400 transition-colors">
                        ← Back to Site
                    </Link>
                </div>

                {/* Page content */}
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
