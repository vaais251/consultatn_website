import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

/** POST /api/admin/experts/[id]/verify — toggle expert verification */
export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin only" } }, { status: 403 });
    }

    const { id } = await params;
    const expert = await prisma.expertProfile.findUnique({ where: { id } });
    if (!expert) {
        return NextResponse.json({ error: { code: "NOT_FOUND", message: "Expert not found" } }, { status: 404 });
    }

    const updated = await prisma.expertProfile.update({
        where: { id },
        data: {
            isVerified: !expert.isVerified,
            verifiedAt: !expert.isVerified ? new Date() : null,
        },
    });

    return NextResponse.json({
        message: updated.isVerified ? "Expert verified" : "Verification removed",
        isVerified: updated.isVerified,
        verifiedAt: updated.verifiedAt,
    });
}
