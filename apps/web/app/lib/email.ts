/**
 * Email abstraction — logs to console in dev.
 * TODO: Replace with Resend/SendGrid in production.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  // In dev/staging: log to console
  console.log("\n" + "═".repeat(60));
  console.log(`📧 EMAIL SENT`);
  console.log(`   To:      ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log("─".repeat(60));
  // Strip HTML tags for console readability
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  console.log(`   ${text.substring(0, 300)}${text.length > 300 ? "..." : ""}`);
  console.log("═".repeat(60) + "\n");
}

/**
 * Send booking confirmation to the client.
 */
export async function sendClientConfirmation({
  clientEmail,
  clientName,
  expertName,
  dateTime,
  meetingLink,
}: {
  clientEmail: string;
  clientName: string;
  expertName: string;
  dateTime: string;
  meetingLink: string;
}) {
  await sendEmail({
    to: clientEmail,
    subject: "Your GB Guide consultation is confirmed ✅",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #f5c542; font-size: 24px; margin: 0;">GB Guide</h1>
          <p style="color: #94a3b8; font-size: 14px;">Your adventure starts here</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px;">Booking Confirmed! 🎉</h2>
        <p>Hi <strong>${clientName}</strong>,</p>
        <p>Great news — your consultation with <strong>${expertName}</strong> is confirmed and paid.</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>📅 When:</strong> ${dateTime}</p>
          <p style="margin: 4px 0;"><strong>👤 Expert:</strong> ${expertName}</p>
          <p style="margin: 4px 0;"><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}" style="color: #f5c542;">${meetingLink}</a></p>
        </div>
        <h3 style="color: #f5c542; font-size: 16px;">How to Prepare</h3>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li>Test your camera and microphone</li>
          <li>Prepare any specific questions about your trip</li>
          <li>Have a notepad ready for recommendations</li>
          <li>Join the meeting 2 minutes early</li>
        </ul>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">
          Questions? Reply to this email or visit <a href="https://gbguide.local" style="color: #f5c542;">gbguide.local</a>
        </p>
      </div>
    `,
  });
}

/**
 * Send booking notification to the expert.
 */
export async function sendExpertNotification({
  expertEmail,
  expertName,
  clientName,
  clientCountry,
  dateTime,
  meetingLink,
  bookingId,
}: {
  expertEmail: string;
  expertName: string;
  clientName: string;
  clientCountry: string;
  dateTime: string;
  meetingLink: string;
  bookingId: string;
}) {
  await sendEmail({
    to: expertEmail,
    subject: `New paid consultation booked — ${clientName}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #f5c542; font-size: 24px; margin: 0;">GB Guide</h1>
          <p style="color: #94a3b8; font-size: 14px;">Expert Dashboard Notification</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px;">New Booking 💼</h2>
        <p>Hi <strong>${expertName}</strong>,</p>
        <p>A new consultation has been booked and paid.</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>👤 Client:</strong> ${clientName} (${clientCountry})</p>
          <p style="margin: 4px 0;"><strong>📅 When:</strong> ${dateTime}</p>
          <p style="margin: 4px 0;"><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}" style="color: #f5c542;">${meetingLink}</a></p>
          <p style="margin: 4px 0;"><strong>🆔 Booking:</strong> ${bookingId}</p>
        </div>
        <p>Please review the client's pre-consultation form on your dashboard before the session.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">
          GB Guide Expert Portal
        </p>
      </div>
    `,
  });
}

/**
 * Send cancellation notification to client and expert.
 */
export async function sendCancellationEmail({
  clientEmail,
  clientName,
  expertEmail,
  expertName,
  dateTime,
  reason,
}: {
  clientEmail: string;
  clientName: string;
  expertEmail: string;
  expertName: string;
  dateTime: string;
  reason: string;
}) {
  const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #f5c542; font-size: 24px; margin: 0;">GB Guide</h1>
        </div>
        <h2 style="color: #ffffff; font-size: 20px;">Booking Cancelled ❌</h2>
        <p>The following consultation has been cancelled:</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>👤 Client:</strong> ${clientName}</p>
          <p style="margin: 4px 0;"><strong>🧑‍💼 Expert:</strong> ${expertName}</p>
          <p style="margin: 4px 0;"><strong>📅 Was scheduled:</strong> ${dateTime}</p>
          <p style="margin: 4px 0;"><strong>📝 Reason:</strong> ${reason}</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">If you have questions, please contact support.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">GB Guide</p>
      </div>
    `;

  await Promise.all([
    sendEmail({ to: clientEmail, subject: "Your GB Guide booking has been cancelled", html }),
    sendEmail({ to: expertEmail, subject: `Booking cancelled — ${clientName}`, html }),
  ]);
}

/**
 * Send reschedule notification to client and expert.
 */
export async function sendRescheduleEmail({
  clientEmail,
  clientName,
  expertEmail,
  expertName,
  oldDateTime,
  newDateTime,
}: {
  clientEmail: string;
  clientName: string;
  expertEmail: string;
  expertName: string;
  oldDateTime: string;
  newDateTime: string;
}) {
  const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #f5c542; font-size: 24px; margin: 0;">GB Guide</h1>
        </div>
        <h2 style="color: #ffffff; font-size: 20px;">Booking Rescheduled 🔄</h2>
        <p>A consultation has been rescheduled:</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>👤 Client:</strong> ${clientName}</p>
          <p style="margin: 4px 0;"><strong>🧑‍💼 Expert:</strong> ${expertName}</p>
          <p style="margin: 4px 0; text-decoration: line-through; color: #ef4444;"><strong>📅 Old time:</strong> ${oldDateTime}</p>
          <p style="margin: 4px 0; color: #22c55e;"><strong>📅 New time:</strong> ${newDateTime}</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">No new payment is required.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">GB Guide</p>
      </div>
    `;

  await Promise.all([
    sendEmail({ to: clientEmail, subject: "Your GB Guide booking has been rescheduled", html }),
    sendEmail({ to: expertEmail, subject: `Booking rescheduled — ${clientName}`, html }),
  ]);
}
