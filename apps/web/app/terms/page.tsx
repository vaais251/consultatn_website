import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — GB Guide",
    description: "Terms and conditions governing the use of the GB Guide platform.",
};

export default function TermsPage() {
    return (
        <section className="section-padding">
            <div className="page-container max-w-3xl mx-auto">
                <h1 className="text-4xl font-heading font-bold mb-2">Terms of Service</h1>
                <p className="text-slate-500 text-sm mb-10">Last updated: February 2026</p>

                <div className="policy-content space-y-6">
                    <div>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using GB Guide, you agree to be bound by these Terms of Service. If you do not agree to these terms,
                            please do not use our platform.
                        </p>
                    </div>

                    <div>
                        <h2>2. Description of Service</h2>
                        <p>
                            GB Guide is a platform that connects travelers with verified local experts from Gilgit-Baltistan, Pakistan.
                            Our experts provide paid video consultations to help you plan your trip with personalized itineraries and insider advice.
                        </p>
                    </div>

                    <div>
                        <h2>3. User Accounts</h2>
                        <ul>
                            <li>You must be at least 18 years old to create an account</li>
                            <li>You are responsible for maintaining the security of your account credentials</li>
                            <li>You must provide accurate and complete information during registration</li>
                            <li>One account per person — duplicate accounts may be suspended</li>
                        </ul>
                    </div>

                    <div>
                        <h2>4. Booking & Payment</h2>
                        <ul>
                            <li>Consultation fees are displayed in USD and are charged at the time of booking</li>
                            <li>All payments are processed securely through Stripe</li>
                            <li>A booking is confirmed only after successful payment</li>
                            <li>Reserved time slots are held for 20 minutes during checkout; abandoned checkouts are automatically released</li>
                            <li>You will receive a confirmation email with your meeting link upon payment</li>
                        </ul>
                    </div>

                    <div>
                        <h2>5. Cancellations</h2>
                        <ul>
                            <li>Cancellations made <strong>more than 24 hours</strong> before the scheduled session are eligible for a full refund</li>
                            <li>Cancellations made <strong>less than 24 hours</strong> before the session may not be eligible for a refund</li>
                            <li>Experts may cancel sessions due to unforeseen circumstances; in such cases, a full refund will be issued automatically</li>
                            <li>For detailed refund information, see our <a href="/refund-policy" className="text-accent-400 hover:underline">Refund Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h2>6. Rescheduling</h2>
                        <p>
                            Bookings may be rescheduled to a different available slot subject to expert availability.
                            Rescheduling must be done at least 12 hours before the original session time. Your original slot will be released
                            and a new confirmation will be sent.
                        </p>
                    </div>

                    <div>
                        <h2>7. Expert Standards</h2>
                        <p>
                            All experts on GB Guide are verified for identity and local knowledge. Experts with the &ldquo;Verified Local Expert&rdquo;
                            badge have undergone additional identity and credential checks by our team.
                        </p>
                    </div>

                    <div>
                        <h2>8. Intellectual Property</h2>
                        <p>
                            All content on GB Guide — including text, images, logos, and design elements — is owned by GB Guide or its content creators.
                            Custom itineraries provided during consultations are for your personal use only and may not be commercially redistributed.
                        </p>
                    </div>

                    <div>
                        <h2>9. Limitation of Liability</h2>
                        <p>
                            GB Guide serves as a platform connecting travelers with experts. While we verify our experts, we are not responsible for
                            the specific travel advice given during consultations. Travelers should exercise their own judgment regarding travel decisions,
                            safety, and local conditions.
                        </p>
                    </div>

                    <div>
                        <h2>10. Changes to Terms</h2>
                        <p>
                            We may update these Terms from time to time. Continued use of the platform after changes are posted constitutes
                            acceptance of the updated Terms.
                        </p>
                    </div>

                    <div>
                        <h2>11. Contact Us</h2>
                        <p>
                            If you have questions about these Terms, please visit our <a href="/contact" className="text-accent-400 hover:underline">Contact Page</a> or
                            email us at <strong>legal@gbguide.com</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
