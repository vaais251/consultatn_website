import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2).max(100),
    country: z.string().max(100).optional(),
    whatsappNumber: z.string().max(20).optional(),
    travelPreferences: z.string().max(500).optional(),
});

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, country, whatsappNumber, travelPreferences } = result.data;

        // Update user + client profile in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: session.user.id },
                data: { name, country: country || null },
            }),
            prisma.clientProfile.upsert({
                where: { userId: session.user.id },
                update: {
                    whatsappNumber: whatsappNumber || null,
                    travelPreferences: travelPreferences || null,
                },
                create: {
                    userId: session.user.id,
                    whatsappNumber: whatsappNumber || null,
                    travelPreferences: travelPreferences || null,
                },
            }),
        ]);

        return NextResponse.json({ message: "Profile updated" });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
