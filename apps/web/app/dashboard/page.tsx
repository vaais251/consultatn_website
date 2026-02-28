import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";
import ProfileForm from "./ProfileForm";

export const metadata = {
    title: "Dashboard — The North Route",
    description: "Manage your bookings, view upcoming consultations, and access your custom itineraries.",
};

const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-500/20 text-amber-400",
    CONFIRMED: "bg-emerald-500/20 text-emerald-400",
    COMPLETED: "bg-blue-500/20 text-blue-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    DRAFT: "bg-slate-500/20 text-slate-400",
};

const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Pending Payment",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    DRAFT: "Draft",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { clientProfile: true },
    });
    if (!user) redirect("/login");

    // Fetch bookings
    const bookings = await prisma.booking.findMany({
        where: { clientId: user.id },
        include: {
            slot: true,
            expert: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    const upcoming = bookings.filter((b) =>
        ["PENDING_PAYMENT", "CONFIRMED"].includes(b.status) &&
        new Date(b.slot.startAt) >= new Date()
    );

    const completed = bookings.filter((b) =>
        b.status === "COMPLETED" ||
        (b.status === "CONFIRMED" && new Date(b.slot.startAt) < new Date())
    );

    return (
        <section className="section-padding" style={{ background: "var(--bg)" }}>
            <div className="page-container max-w-6xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">
                            Welcome back, <span className="gradient-text">{user.name}</span>
                        </h1>
                        <p className="text-[var(--text-muted)] mt-1">
                            {user.role === "ADMIN" && "👑 Administrator"}
                            {user.role === "EXPERT" && "⭐ Expert"}
                            {user.role === "CLIENT" && "✈️ Traveler"}
                            {" · "}
                            {user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/experts" className="btn-accent text-sm">
                            + New Booking
                        </Link>
                        <SignOutButton />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Upcoming Sessions", value: upcoming.length.toString(), icon: "📅" },
                        { label: "Completed Sessions", value: completed.length.toString(), icon: "✅" },
                        { label: "Total Bookings", value: bookings.length.toString(), icon: "🗺️" },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl p-6 border border-[var(--border)]" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-heading font-bold gradient-text">{stat.value}</div>
                            <div className="text-[var(--text-muted)] text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* My Bookings */}
                <div className="rounded-2xl p-8 mb-8 border border-[var(--border)]" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
                    <h2 className="text-xl font-heading font-semibold mb-4">My Bookings</h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🏔️</div>
                            <p className="text-[var(--text-muted)] mb-4">No bookings yet</p>
                            <Link href="/experts" className="btn-primary text-sm">
                                Book Your First Consultation
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border)]">
                                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Date & Time</th>
                                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Expert</th>
                                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                                        <th className="text-right py-3 px-4 text-slate-500 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="text-white">
                                                    {new Date(booking.slot.startAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                                <div className="text-slate-500 text-xs">
                                                    {new Date(booking.slot.startAt).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {" – "}
                                                    {new Date(booking.slot.endAt).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-white">{booking.expert.user.name}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-white/10 text-slate-400"}`}>
                                                    {statusLabels[booking.status] || booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right space-x-2">
                                                {booking.status === "PENDING_PAYMENT" && (
                                                    <Link
                                                        href={`/dashboard/bookings/${booking.id}`}
                                                        className="inline-block px-3 py-1.5 rounded-lg bg-accent-400 text-navy-950 text-xs font-semibold hover:bg-accent-300 transition-colors"
                                                    >
                                                        💳 Pay Now
                                                    </Link>
                                                )}
                                                {booking.status === "CONFIRMED" && booking.meetingLink && (
                                                    <a
                                                        href={booking.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
                                                    >
                                                        🎥 Join
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/dashboard/bookings/${booking.id}`}
                                                    className="text-accent-400 hover:text-accent-300 text-xs font-medium transition-colors"
                                                >
                                                    View Details →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div className="rounded-2xl p-8 border border-[var(--border)]" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
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
            </div>
        </section>
    );
}
