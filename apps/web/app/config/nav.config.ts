/**
 * Navigation configuration — single source of truth.
 */

export const topNav = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/destinations" },
    { label: "Book", href: "/experts" },
] as const;

export const helpMenu = [
    { label: "Services & Pricing", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact & FAQ", href: "/contact" },
] as const;

export const cta = {
    label: "Book Consultation",
    href: "/experts",
} as const;

/** Routes that highlight each top-level tab */
export const activeMap: Record<string, string[]> = {
    "/": ["/"],
    "/destinations": ["/destinations"],
    "/experts": ["/experts", "/book"],
};

/** Routes where Help dropdown is highlighted */
export const helpRoutes = ["/services", "/blog", "/about", "/contact"];
