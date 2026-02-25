/**
 * Generate a meeting link for a confirmed booking.
 * Currently returns a deterministic stub URL.
 * TODO: Integrate Google Calendar API or Zoom API for real links.
 */
export function generateMeetingLink(bookingId: string): string {
    const slug = bookingId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase();
    return `https://meet.google.com/lookup/${slug}`;
}
