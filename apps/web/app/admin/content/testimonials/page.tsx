import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import TestimonialPublishToggle from "./PublishToggle";

export const metadata = { title: "Testimonials — GB Guide Admin" };

export default async function AdminTestimonialsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Testimonials</h1>
                    <p className="text-slate-400">
                        Manage traveler testimonials. Published ones appear on public pages.
                    </p>
                </div>
                <Link href="/admin/content/testimonials/new" className="btn-accent text-sm">
                    + New Testimonial
                </Link>
            </div>

            {testimonials.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-4xl mb-3">💬</p>
                    <p className="text-slate-400">No testimonials yet. Add your first one.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {testimonials.map((t) => (
                        <div key={t.id} className="glass rounded-xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent-400/10 flex items-center justify-center text-lg shrink-0">
                                {"★".repeat(t.rating)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-heading font-semibold text-sm">{t.name}</span>
                                    <span className="text-slate-500 text-xs">📍 {t.country}</span>
                                    {t.tripType && <span className="text-slate-600 text-xs">· {t.tripType}</span>}
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <TestimonialPublishToggle id={t.id} isPublished={t.isPublished} />
                                <Link
                                    href={`/admin/content/testimonials/${t.id}/edit`}
                                    className="text-slate-400 hover:text-accent-400 text-sm transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
