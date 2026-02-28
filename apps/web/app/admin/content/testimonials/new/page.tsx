import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import TestimonialForm from "./Form";

export const metadata = { title: "New Testimonial — The North Route Admin" };

export default async function NewTestimonialPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

    return (
        <>
            <h1 className="text-3xl font-heading font-bold mb-8">New Testimonial</h1>
            <TestimonialForm />
        </>
    );
}
