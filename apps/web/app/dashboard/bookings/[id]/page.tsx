import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ new?: string }>;
}

const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    DRAFT: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Pending Payment",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    DRAFT: "Draft",
};

export default async function BookingDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { new: isNew } = await searchParams;

    const session = await auth();
    if (!session?.user) redirect("/login");

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            slot: true,
            expert: { include: { user: { select: { name: true, email: true } } } },
            preConsultationForm: true,
            payment: true,
        },
    });

    if (!booking) notFound();

    // Only the booking owner or admin can view
    if (booking.clientId !== session.user.id && session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const formatDate = (d: Date) =>
        new Date(d).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatTime = (d: Date) =>
        new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return (
        <section className="section-padding">
            <div className="page-container max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/dashboard" className="text-sm text-slate-500 hover:text-accent-400 transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>

                {isNew && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
                        <span className="text-lg">🎉</span>
                        Booking created successfully! Your slot is reserved.
                    </div>
                )}

                <div className="glass rounded-2xl p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-heading font-bold mb-1">Booking Details</h1>
                            <p className="text-slate-500 text-xs font-mono">ID: {booking.id}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[booking.status]}`}>
                            {statusLabels[booking.status] || booking.status}
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* Expert */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-navy-950 font-bold text-lg shrink-0">
                                {booking.expert.user.name.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <div>
                                <p className="font-medium text-white">{booking.expert.user.name}</p>
                                <p className="text-slate-400 text-sm">
                                    {booking.expert.specialty} · {booking.expert.region}
                                </p>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Date & Time</p>
                            <p className="text-white font-medium">{formatDate(booking.slot.startAt)}</p>
                            <p className="text-slate-300 text-sm">
                                {formatTime(booking.slot.startAt)} – {formatTime(booking.slot.endAt)}
                            </p>
                        </div>

                        {/* Status Actions */}
                        {booking.status === "PENDING_PAYMENT" && (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-sm font-medium mb-2">💳 Payment Required</p>
                                <p className="text-slate-400 text-xs mb-3">
                                    Payment integration coming soon. Your slot is reserved in the meantime.
                                </p>
                                <button
                                    disabled
                                    className="btn-accent text-sm opacity-50 cursor-not-allowed"
                                    title="Payment coming next"
                                >
                                    Pay Now (Coming Soon)
                                </button>
                            </div>
                        )}

                        {booking.status === "CONFIRMED" && (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-emerald-400 text-sm font-medium mb-2">✅ Confirmed</p>
                                {booking.meetingLink ? (
                                    <a
                                        href={booking.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-accent text-sm"
                                    >
                                        Join Meeting
                                    </a>
                                ) : (
                                    <p className="text-slate-400 text-xs">
                                        Meeting link will be sent before your session.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pre-Consultation Form */}
                {booking.preConsultationForm && (
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-lg font-heading font-semibold mb-4">Pre-Consultation Info</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-slate-500">Nationality:</span>{" "}
                                <span className="text-white">{booking.preConsultationForm.nationality}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Travel Dates:</span>{" "}
                                <span className="text-white">{booking.preConsultationForm.travelDates}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Interests:</span>{" "}
                                <span className="text-slate-300">{booking.preConsultationForm.interests}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Questions:</span>{" "}
                                <span className="text-slate-300">{booking.preConsultationForm.questions}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
