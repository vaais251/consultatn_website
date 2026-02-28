import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import BookingStepper from "./BookingStepper";

interface Props {
    params: Promise<{ expertId: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { expertId } = await params;
    const user = await prisma.user.findUnique({
        where: { id: expertId },
        select: { name: true },
    });
    return {
        title: user ? `Book ${user.name} — The North Route` : "Book Consultation",
    };
}

export default async function BookPage({ params }: Props) {
    const { expertId } = await params;
    const session = await auth();

    if (!session?.user) {
        redirect(`/login?callbackUrl=/book/${expertId}`);
    }

    const expert = await prisma.user.findUnique({
        where: { id: expertId, role: "EXPERT" },
        include: { expertProfile: true },
    });

    if (!expert || !expert.expertProfile || !expert.expertProfile.isActive) {
        notFound();
    }

    return (
        <section className="section-padding">
            <div className="page-container max-w-4xl mx-auto">
                <BookingStepper
                    expertId={expertId}
                    expertName={expert.name}
                    specialty={expert.expertProfile.specialty || ""}
                    region={expert.expertProfile.region || ""}
                    hourlyRate={expert.expertProfile.hourlyRate || 50}
                />
            </div>
        </section>
    );
}
