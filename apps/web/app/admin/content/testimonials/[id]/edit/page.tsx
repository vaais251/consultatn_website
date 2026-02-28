import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import TestimonialForm from "../../new/Form";

export const metadata = { title: "Edit Testimonial — GB Guide Admin" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) notFound();

    return (
        <>
            <h1 className="text-3xl font-heading font-bold mb-8">Edit Testimonial</h1>
            <TestimonialForm testimonial={testimonial} />
        </>
    );
}
