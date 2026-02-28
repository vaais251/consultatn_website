import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — The North Route",
    description: "How The North Route collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <section className="section-padding" style={{ background: "var(--bg)" }}>
            <div className="page-container max-w-3xl mx-auto">
                <h1 className="text-4xl font-heading font-bold mb-2">Privacy Policy</h1>
                <p className="text-slate-500 text-sm mb-10">Last updated: February 2026</p>

                <div className="policy-content space-y-6">
                    <div>
                        <h2>1. Information We Collect</h2>
                        <p>When you use The North Route, we collect the following types of information:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, country, and password hash when you register.</li>
                            <li><strong>Booking Information:</strong> Travel preferences, consultation details, pre-consultation form responses, and scheduling data.</li>
                            <li><strong>Payment Information:</strong> Payments are processed securely through Stripe. We do not store credit card numbers or sensitive payment data on our servers.</li>
                            <li><strong>Usage Data:</strong> Pages visited, features used, and session duration to help us improve our platform.</li>
                            <li><strong>Contact Form Data:</strong> Name, email, and message content when you reach out through our contact form.</li>
                        </ul>
                    </div>

                    <div>
                        <h2>2. How We Use Your Information</h2>
                        <p>We use the collected information to:</p>
                        <ul>
                            <li>Process and manage your bookings and consultations</li>
                            <li>Facilitate secure payments through Stripe</li>
                            <li>Send booking confirmations, reminders, and notifications</li>
                            <li>Respond to your inquiries and support requests</li>
                            <li>Improve our services and user experience</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </div>

                    <div>
                        <h2>3. Payment Security</h2>
                        <p>
                            All payment transactions are processed through <strong>Stripe</strong>, a PCI DSS Level 1 certified payment processor.
                            The North Route does not store, process, or have access to your complete credit card information.
                            Your payment data is encrypted end-to-end by Stripe.
                        </p>
                    </div>

                    <div>
                        <h2>4. Data Sharing</h2>
                        <p>We do not sell your personal information. We share data only with:</p>
                        <ul>
                            <li><strong>Our Experts:</strong> Relevant booking details to facilitate your consultation</li>
                            <li><strong>Payment Processors:</strong> Stripe, for payment processing</li>
                            <li><strong>Service Providers:</strong> Email delivery services for notifications</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </div>

                    <div>
                        <h2>5. Data Retention</h2>
                        <p>
                            We retain your account and booking data for as long as your account is active or as needed to provide services.
                            You may request deletion of your account and associated data by contacting us.
                        </p>
                    </div>

                    <div>
                        <h2>6. Cookies</h2>
                        <p>
                            We use essential cookies for authentication and session management. These are necessary for the platform to function properly.
                            We do not use tracking or advertising cookies.
                        </p>
                    </div>

                    <div>
                        <h2>7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </div>

                    <div>
                        <h2>8. Contact Us</h2>
                        <p>
                            For privacy-related inquiries, please reach out via our <a href="/contact" className="text-accent-400 hover:underline">Contact Page</a> or
                            email us at <strong>privacy@thenorthroute.com</strong>.
                            We aim to respond within 48 hours.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
