import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";
import ProfileForm from "./ProfileForm";

export const metadata = {
    title: "Dashboard — GB Guide",
    description: "Manage your bookings, view upcoming consultations, and access your custom itineraries.",
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user with client profile
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { clientProfile: true },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <section className="section-padding">
            <div className="page-container max-w-6xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">
                            Welcome back, <span className="gradient-text">{user.name}</span>
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {user.role === "ADMIN" && "👑 Administrator"}
                            {user.role === "EXPERT" && "⭐ Expert"}
                            {user.role === "CLIENT" && "✈️ Traveler"}
                            {" · "}
                            {user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/services" className="btn-accent text-sm">
                            + New Booking
                        </Link>
                        <SignOutButton />
                    </div>
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

                {/* Profile Section */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-heading font-semibold mb-6">Your Profile</h2>
                    <ProfileForm
                        userId={user.id}
                        initialData={{
                            name: user.name,
                            country: user.country || "",
                            whatsappNumber: user.clientProfile?.whatsappNumber || "",
                            travelPreferences: user.clientProfile?.travelPreferences || "",
                        }}
                    />
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
            </div>
        </section>
    );
}
