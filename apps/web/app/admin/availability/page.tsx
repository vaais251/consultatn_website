import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import AvailabilityManager from "./AvailabilityManager";

export const metadata = { title: "Availability Management — The North Route Admin" };

export default async function AdminAvailabilityPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    const experts = await prisma.expertProfile.findMany({
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
    });

    const expertList = experts.map((e) => ({
        profileId: e.id,
        userId: e.user.id,
        name: e.user.name,
        isActive: e.isActive,
    }));

    return (
        <section className="section-padding">
            <div className="page-container max-w-5xl mx-auto">
                <h1 className="text-3xl font-heading font-bold mb-2">Availability Management</h1>
                <p className="text-slate-400 mb-8">Create and manage expert time slots.</p>
                <AvailabilityManager experts={expertList} />
            </div>
        </section>
    );
}
