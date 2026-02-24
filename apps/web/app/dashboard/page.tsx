import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dashboard — GB Guide",
    description: "Manage your bookings, view upcoming consultations, and access your custom itineraries.",
};

export default function DashboardPage() {
    return (
        <section className="section-padding">
            <div className="page-container max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">
                            Welcome back, <span className="gradient-text">Traveler</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Here&apos;s an overview of your upcoming trips</p>
                    </div>
                    <Link href="/services" className="btn-accent text-sm">
                        + New Booking
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Upcoming Sessions", value: "0", icon: "📅" },
                        { label: "Completed Sessions", value: "0", icon: "✅" },
                        { label: "Itineraries Received", value: "0", icon: "🗺️" },
                    ].map((stat) => (
                        <div key={stat.label} className="glass rounded-2xl p-6">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-heading font-bold gradient-text">{stat.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Upcoming Bookings */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-heading font-semibold mb-4">Upcoming Consultations</h2>
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🏔️</div>
                        <p className="text-slate-400 mb-4">No upcoming consultations yet</p>
                        <Link href="/services" className="btn-primary text-sm">
                            Book Your First Consultation
                        </Link>
                    </div>
                </div>

                {/* Past Bookings */}
                <div className="glass rounded-2xl p-8">
                    <h2 className="text-xl font-heading font-semibold mb-4">Past Sessions & Itineraries</h2>
                    <div className="text-center py-8">
                        <p className="text-slate-500 text-sm">Your completed sessions and itineraries will appear here.</p>
                    </div>
                </div>

                <div className="mt-8 glass rounded-xl p-6 text-center">
                    <p className="text-slate-400 text-sm">
                        🚧 <strong>TODO:</strong> Connect to auth, load real bookings from DB,
                        show itinerary PDFs, meeting links, and expert chat history.
                    </p>
                </div>
            </div>
        </section>
    );
}
