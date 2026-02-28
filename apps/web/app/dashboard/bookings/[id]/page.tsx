import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PayNowButton from "./PayNowButton";
import CancelButton from "./CancelButton";
import RefundButton from "./RefundButton";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ new?: string; paid?: string; canceled?: string }>;
}

const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    EXPIRED: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    REFUND_PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    REFUNDED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    DRAFT: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Pending Payment",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
    REFUND_PENDING: "Refund Pending",
    REFUNDED: "Refunded",
    DRAFT: "Draft",
};

export default async function BookingDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const sp = await searchParams;

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

                {/* Success / Cancel banners */}
                {sp.new && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
                        <span className="text-lg">🎉</span>
                        Booking created successfully! Your slot is reserved. Complete payment to confirm.
                    </div>
                )}

                {sp.paid && booking.status === "CONFIRMED" && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
                        <span className="text-lg">✅</span>
                        Payment successful! Your consultation is confirmed. Check your email for the meeting link.
                    </div>
                )}

                {sp.canceled && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-3">
                        <span className="text-lg">ℹ️</span>
                        Payment was cancelled. You can try again anytime — your slot is still reserved.
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
                                {booking.expert.user.name.split(" ").map((w: string) => w[0]).join("")}
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

                        {/* Payment Info */}
                        {booking.payment && (
                            <div className="p-4 rounded-xl bg-white/5">
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Payment</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">${booking.payment.amountUsd} USD</p>
                                        <p className="text-slate-500 text-xs">via {booking.payment.provider}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.payment.status === "PAID"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : booking.payment.status === "INITIATED"
                                            ? "bg-amber-500/20 text-amber-400"
                                            : "bg-slate-500/20 text-slate-400"
                                        }`}>
                                        {booking.payment.status}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Status Actions */}
                        {booking.status === "PENDING_PAYMENT" && (
                            <div className="p-4 rounded-xl bg-accent-400/10 border border-accent-400/20">
                                <p className="text-accent-400 text-sm font-medium mb-2">💳 Complete Your Payment</p>
                                <p className="text-slate-400 text-xs mb-3">
                                    Secure checkout via Stripe. Your slot is reserved until you complete payment.
                                </p>
                                <PayNowButton bookingId={booking.id} />
                            </div>
                        )}

                        {booking.status === "CONFIRMED" && (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-emerald-400 text-sm font-medium mb-2">✅ Consultation Confirmed</p>
                                {booking.meetingLink ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <span>🔗</span>
                                            <a
                                                href={booking.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent-400 hover:underline break-all"
                                            >
                                                {booking.meetingLink}
                                            </a>
                                        </div>
                                        <a
                                            href={booking.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-accent text-sm inline-block"
                                        >
                                            🎥 Join Meeting
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-xs">
                                        Meeting link will be sent before your session.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Refunded info */}
                        {booking.status === "REFUNDED" && (
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <p className="text-purple-400 text-sm font-medium">💰 This booking has been refunded</p>
                                {booking.payment?.refundedAt && (
                                    <p className="text-slate-400 text-xs mt-1">
                                        Refunded on {formatDate(booking.payment.refundedAt)}
                                        {booking.payment.refundAmountUsd && ` — $${booking.payment.refundAmountUsd} USD`}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Expired info */}
                        {booking.status === "EXPIRED" && (
                            <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
                                <p className="text-slate-400 text-sm font-medium">⏰ This reservation expired</p>
                                <p className="text-slate-500 text-xs mt-1">
                                    Payment was not completed within the reservation window. You can create a new booking.
                                </p>
                            </div>
                        )}

                        {/* Action buttons for CONFIRMED bookings */}
                        {booking.status === "CONFIRMED" && booking.clientId === session.user.id && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-slate-400 text-xs mb-3">Booking Actions</p>
                                <div className="flex flex-wrap gap-3">
                                    <CancelButton bookingId={booking.id} />
                                    <Link
                                        href={`/dashboard/bookings/${booking.id}/reschedule`}
                                        className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                                    >
                                        🔄 Reschedule
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Admin: Refund button */}
                        {session.user.role === "ADMIN" && ["CONFIRMED", "CANCELLED"].includes(booking.status) && booking.payment?.status === "PAID" && (
                            <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                                <p className="text-amber-400 text-xs uppercase tracking-wider mb-2">Admin Actions</p>
                                <RefundButton bookingId={booking.id} />
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
