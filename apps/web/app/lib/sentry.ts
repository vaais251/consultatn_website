/**
 * Optional Sentry integration for The North Route.
 * Only initializes if SENTRY_DSN is set and @sentry/nextjs is installed.
 *
 * Usage:
 *   import { captureException, captureMessage } from "@/app/lib/sentry";
 *   captureException(error);
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let sentryModule: any = null;
let initAttempted = false;

async function initSentry() {
    if (initAttempted) return;
    initAttempted = true;

    const dsn = process.env.SENTRY_DSN;
    if (!dsn) return;

    try {
        sentryModule = await import("@sentry/nextjs" as string);
        sentryModule.init({
            dsn,
            tracesSampleRate: 0.1,
            environment: process.env.NODE_ENV || "development",
        });
        console.log("✅ Sentry initialized");
    } catch {
        console.warn("⚠️ Sentry SDK not installed — skipping initialization");
    }
}

export async function captureException(error: unknown) {
    await initSentry();
    if (sentryModule) {
        sentryModule.captureException(error);
    }
}

export async function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
    await initSentry();
    if (sentryModule) {
        sentryModule.captureMessage(message, level);
    }
}
