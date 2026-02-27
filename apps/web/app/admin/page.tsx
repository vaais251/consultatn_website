import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Admin Panel — GB Guide",
};

export default async function AdminPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    return (
        <section className="section-padding">
            <div className="page-container max-w-4xl mx-auto">
                <h1 className="text-3xl font-heading font-bold mb-2">Admin Panel</h1>
                <p className="text-slate-400 mb-8">Manage experts, content, and platform settings.</p>

                <div className="grid sm:grid-cols-2 gap-6">
                    <Link href="/admin/content" className="glass rounded-2xl p-6 hover:border-accent-400/30 transition-all group">
                        <div className="text-3xl mb-3">📝</div>
                        <h2 className="text-lg font-heading font-semibold group-hover:text-accent-400 transition-colors">Content Management</h2>
                        <p className="text-slate-400 text-sm mt-1">Manage destinations, blog posts, and site content</p>
                    </Link>
                    <Link href="/admin/availability" className="glass rounded-2xl p-6 hover:border-accent-400/30 transition-all group">
                        <div className="text-3xl mb-3">📅</div>
                        <h2 className="text-lg font-heading font-semibold group-hover:text-accent-400 transition-colors">Availability Management</h2>
                        <p className="text-slate-400 text-sm mt-1">Create and manage expert availability slots</p>
                    </Link>
                    <div className="glass rounded-2xl p-6 opacity-50 cursor-not-allowed">
                        <div className="text-3xl mb-3">👥</div>
                        <h2 className="text-lg font-heading font-semibold">User Management</h2>
                        <p className="text-slate-400 text-sm mt-1">Coming soon — manage users and roles</p>
                    </div>
                    <div className="glass rounded-2xl p-6 opacity-50 cursor-not-allowed">
                        <div className="text-3xl mb-3">📊</div>
                        <h2 className="text-lg font-heading font-semibold">Analytics</h2>
                        <p className="text-slate-400 text-sm mt-1">Coming soon — bookings, revenue, traffic</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
