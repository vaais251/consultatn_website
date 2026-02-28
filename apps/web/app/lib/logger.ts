/**
 * Structured logger for The North Route
 * Outputs JSON logs with level, timestamp, event, and optional metadata.
 * Avoids logging PII beyond email.
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
    level: LogLevel;
    event: string;
    timestamp: string;
    requestId?: string;
    [key: string]: unknown;
}

function log(level: LogLevel, event: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
        level,
        event,
        timestamp: new Date().toISOString(),
        ...meta,
    };

    const output = JSON.stringify(entry);

    switch (level) {
        case "error":
            console.error(output);
            break;
        case "warn":
            console.warn(output);
            break;
        default:
            console.log(output);
    }
}

export const logger = {
    info: (event: string, meta?: Record<string, unknown>) => log("info", event, meta),
    warn: (event: string, meta?: Record<string, unknown>) => log("warn", event, meta),
    error: (event: string, meta?: Record<string, unknown>) => log("error", event, meta),

    // ─── Domain Events ─────────────────────────────────
    bookingCreated: (bookingId: string, clientId: string, expertId: string, slotId: string) =>
        log("info", "booking.created", { bookingId, clientId, expertId, slotId }),

    reservationCreated: (bookingId: string, slotId: string, expiresAt: string) =>
        log("info", "reservation.created", { bookingId, slotId, expiresAt }),

    reservationExpired: (bookingId: string, slotId: string) =>
        log("info", "reservation.expired", { bookingId, slotId }),

    paymentConfirmed: (bookingId: string, amountUsd: number) =>
        log("info", "payment.confirmed", { bookingId, amountUsd }),

    checkoutSessionCreated: (bookingId: string, sessionId: string) =>
        log("info", "checkout.session.created", { bookingId, sessionId }),

    bookingCancelled: (bookingId: string, reason?: string) =>
        log("info", "booking.cancelled", { bookingId, reason }),

    bookingRescheduled: (oldBookingId: string, newBookingId: string) =>
        log("info", "booking.rescheduled", { oldBookingId, newBookingId }),

    refundIssued: (bookingId: string, refundId: string, amountUsd: number) =>
        log("info", "refund.issued", { bookingId, refundId, amountUsd }),

    rateLimited: (ip: string, route: string) =>
        log("warn", "rate.limited", { ip, route }),
};
