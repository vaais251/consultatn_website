import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedPrefixes = ["/dashboard"];

// Role-based route guards
const roleRoutes: Record<string, string[]> = {
    "/admin": ["ADMIN"],
    "/expert": ["EXPERT", "ADMIN"],
};

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if route is protected
    const isProtected = protectedPrefixes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if route has role requirements
    const roleEntry = Object.entries(roleRoutes).find(([route]) =>
        pathname.startsWith(route)
    );

    if (!isProtected && !roleEntry) {
        return NextResponse.next();
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

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/expert/:path*"],
};
