import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund Policy — GB Guide",
    description: "GB Guide refund and cancellation policy for video consultations.",
};

export default function RefundPolicyPage() {
    return (
        <section className="section-padding">
            <div className="page-container max-w-3xl mx-auto">
                <h1 className="text-4xl font-heading font-bold mb-2">Refund Policy</h1>
                <p className="text-slate-500 text-sm mb-10">Last updated: February 2026</p>

                <div className="policy-content space-y-6">
                    <div>
                        <h2>Overview</h2>
                        <p>
                            We want you to feel confident when booking a consultation with our experts.
                            This policy outlines when and how refunds are processed.
                        </p>
                    </div>

                    <div>
                        <h2>Cancellation Window</h2>
                        <h3>More than 24 hours before session</h3>
                        <p>
                            You may cancel your booking for a <strong>full refund</strong>. The refund will be processed
                            back to your original payment method via Stripe.
                        </p>

                        <h3>Less than 24 hours before session</h3>
                        <p>
                            Late cancellations (under 24 hours) are <strong>not eligible for a refund</strong> unless there are
                            extenuating circumstances. Contact us to discuss your situation.
                        </p>

                        <h3>No-shows</h3>
                        <p>
                            If you do not attend your scheduled session without prior cancellation, no refund will be issued.
                        </p>
                    </div>

                    <div>
                        <h2>Expert-Initiated Cancellations</h2>
                        <p>
                            If an expert cancels the session for any reason, you will receive a <strong>full automatic refund</strong>.
                            We will also assist you in rebooking with the same expert or a different one.
                        </p>
                    </div>

                    <div>
                        <h2>Refund Timeline</h2>
                        <ul>
                            <li><strong>Processing time:</strong> Refunds are initiated within 1-2 business days of the cancellation</li>
                            <li><strong>Bank processing:</strong> Depending on your bank or card issuer, the refund may take 5-10 business days to appear on your statement</li>
                            <li>You will receive an email confirmation when the refund is processed</li>
                        </ul>
                    </div>

                    <div>
                        <h2>How to Request a Refund</h2>
                        <p>You can cancel your booking and request a refund through:</p>
                        <ul>
                            <li><strong>Your Dashboard:</strong> Navigate to your booking and click &ldquo;Cancel Booking&rdquo;</li>
                            <li><strong>Contact Us:</strong> Email <strong>support@gbguide.com</strong> with your booking ID</li>
                        </ul>
                    </div>

                    <div>
                        <h2>Disputes</h2>
                        <p>
                            If you are unsatisfied with a consultation or believe the service was not as described,
                            please contact us within 7 days of the session. We will review your case and may offer
                            a partial or full refund at our discretion.
                        </p>
                    </div>

                    <div>
                        <h2>Rescheduling Instead of Refund</h2>
                        <p>
                            Don&apos;t want to cancel? You can <strong>reschedule</strong> your booking to a different available
                            time slot at no extra charge. Rescheduling must be done at least 12 hours before the original session.
                        </p>
                    </div>

                    <div>
                        <h2>Contact Us</h2>
                        <p>
                            For refund inquiries, visit our <a href="/contact" className="text-accent-400 hover:underline">Contact Page</a> or
                            email <strong>support@gbguide.com</strong>. We respond within 48 hours.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
