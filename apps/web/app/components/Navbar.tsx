"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { topNav, helpMenu, helpRoutes, cta } from "@/app/config/nav.config";
import { useTheme } from "@/app/components/ThemeProvider";

/* ─── Active route helpers ─────────────────────────────── */
function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
function isHelpActive(pathname: string) {
  return helpRoutes.some((r) => pathname.startsWith(r));
}

/* ─── Icons ────────────────────────────────────────────── */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l3 3 3-3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  /* Scroll state */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Help dropdown (desktop) */
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const closeHelp = useCallback(() => setHelpOpen(false), []);
  useEffect(() => {
    if (!helpOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeHelp(); };
    const onClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) closeHelp();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [helpOpen, closeHelp]);

  /* Mobile drawer */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpAccordion, setHelpAccordion] = useState(false);
  useEffect(() => { setDrawerOpen(false); setHelpAccordion(false); }, [pathname]);

  /* User menu (desktop) */
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!userOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userOpen]);

  /* ─── Shared link style ──────────────────────────────── */
  const linkClass = (active: boolean) =>
    `px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active
      ? "text-accent-500 bg-accent-400/10"
      : "text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] hover:bg-[var(--surface-hover)]"
    }`;

  /* ─── Dropdown style ─────────────────────────────────── */
  const dropdownClass = "absolute top-full right-0 mt-2 py-2 rounded-xl border shadow-lg" +
    " bg-[var(--bg-elevated)] border-[var(--border)]";
  const dropdownItemClass = (active: boolean) =>
    `block px-4 py-2.5 text-sm transition-colors ${active
      ? "text-accent-500 bg-accent-400/5"
      : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "shadow-[var(--shadow-md)] border-b border-[var(--border)]"
          : ""
          }`}
        style={{ background: scrolled ? "var(--nav-bg-scroll)" : "var(--nav-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <nav className="page-container flex items-center justify-between h-16" role="navigation" aria-label="Main navigation">

          {/* ── Brand ──────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-sm font-heading transition-transform group-hover:scale-110">
              NR
            </div>
            <span className="text-lg font-heading font-bold text-[var(--text)] hidden sm:block">
              the<span className="text-accent-500">north</span>route
            </span>
          </Link>

          {/* ── Desktop Nav (center) ───────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {topNav.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(isActive(link.href, pathname))}>
                {link.label}
              </Link>
            ))}

            {/* Help dropdown */}
            <div ref={helpRef} className="relative">
              <button
                onClick={() => setHelpOpen((v) => !v)}
                aria-expanded={helpOpen}
                aria-controls="help-menu"
                className={`${linkClass(isHelpActive(pathname))} flex items-center gap-1.5`}
              >
                Help
                <ChevronDown className={`transition-transform duration-200 ${helpOpen ? "rotate-180" : ""}`} />
              </button>

              {helpOpen && (
                <ul id="help-menu" role="menu" className={`${dropdownClass} w-52`}>
                  {helpMenu.map((item) => (
                    <li key={item.href} role="none">
                      <Link href={item.href} role="menuitem" onClick={closeHelp}
                        className={dropdownItemClass(pathname.startsWith(item.href))}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Desktop right side ─────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all duration-200"
            >
              <span key={theme} className="theme-icon-enter">
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>

            {isLoggedIn ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-105"
                  aria-label="User menu"
                >
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </button>
                {userOpen && (
                  <div className={`${dropdownClass} w-44`}>
                    <Link href="/dashboard" onClick={() => setUserOpen(false)} className={dropdownItemClass(false)}>
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserOpen(false)} className={dropdownItemClass(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-[var(--border)] my-1" />
                    <button
                      onClick={() => { setUserOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-3.5 py-2 text-sm font-medium text-[var(--nav-text)] hover:text-[var(--nav-text-hover)] transition-colors">
                Sign In
              </Link>
            )}

            {/* CTA */}
            <Link href={cta.href} className="btn-accent text-sm !py-2 !px-5">
              {cta.label}
            </Link>
          </div>

          {/* ── Mobile right side ──────────────────────── */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme toggle (mobile) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-all"
            >
              <span key={theme} className="theme-icon-enter">
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle navigation"
              aria-expanded={drawerOpen}
            >
              <span className={`block w-6 h-0.5 bg-[var(--text)] transition-all duration-300 ${drawerOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-[var(--text)] transition-all duration-300 ${drawerOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-[var(--text)] transition-all duration-300 ${drawerOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* ═══ Mobile Drawer ════════════════════════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute top-16 left-0 right-0 bottom-0 bg-[var(--bg)] border-t border-[var(--border)] flex flex-col overflow-y-auto">
            <div className="flex-1 px-4 pt-4 space-y-1">
              {topNav.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive(link.href, pathname)
                    ? "text-accent-500 bg-accent-400/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                    }`}>
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => setHelpAccordion((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isHelpActive(pathname)
                  ? "text-accent-500 bg-accent-400/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                  }`}>
                Help
                <ChevronDown className={`transition-transform duration-200 ${helpAccordion ? "rotate-180" : ""}`} />
              </button>
              {helpAccordion && (
                <div className="pl-4 space-y-0.5">
                  {helpMenu.map((item) => (
                    <Link key={item.href} href={item.href}
                      className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${pathname.startsWith(item.href) ? "text-accent-500" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                        }`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <div className="pt-2 space-y-1 border-t border-[var(--border)] mt-2">
                  <Link href="/dashboard" className="block px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-red-500 rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
              {!isLoggedIn && (
                <div className="pt-2 border-t border-[var(--border)] mt-2">
                  <Link href="/login" className="block px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 p-4 border-t border-[var(--border)] bg-[var(--bg)]">
              <Link href={cta.href} className="btn-accent text-sm w-full text-center block !py-3">
                {cta.label}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
