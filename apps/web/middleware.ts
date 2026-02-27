import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedPrefixes = ["/dashboard", "/book"];

// Role-based route guards
const roleRoutes: Record<string, string[]> = {
    "/admin": ["ADMIN"],
    "/expert": ["EXPERT", "ADMIN"],
};

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Security Headers (all responses) ────────────────
    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );

    // ── Route Protection ────────────────────────────────
    const isProtected = protectedPrefixes.some((route) =>
        pathname.startsWith(route)
    );

    const roleEntry = Object.entries(roleRoutes).find(([route]) =>
        pathname.startsWith(route)
    );

    if (!isProtected && !roleEntry) {
        return response;
    }

    // Use getToken to decode JWT without importing Prisma (Edge-safe)
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });

    // Not authenticated → redirect to login
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (roleEntry) {
        const [, allowedRoles] = roleEntry;
        const userRole = token.role as string;

        if (!allowedRoles.includes(userRole)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Security headers for all pages
        "/((?!_next|api/auth).*)",
    ],
};
