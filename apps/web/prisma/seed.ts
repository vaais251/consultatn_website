import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding GB Guide database...\n");

    // ─── Admin User ─────────────────────────────────────
    const adminPassword = await bcrypt.hash("admin123!", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@gbguide.local" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@gbguide.local",
            passwordHash: adminPassword,
            country: "Pakistan",
            role: "ADMIN",
        },
    });
    console.log(`✅ Admin: ${admin.email} (role: ${admin.role})`);

    // ─── Expert Users ───────────────────────────────────
    const expertPassword = await bcrypt.hash("expert123!", 12);

    const expert1 = await prisma.user.upsert({
        where: { email: "ahmad.khan@gbguide.local" },
        update: {},
        create: {
            name: "Ahmad Khan",
            email: "ahmad.khan@gbguide.local",
            passwordHash: expertPassword,
            country: "Pakistan",
            role: "EXPERT",
            expertProfile: {
                create: {
                    bio: "Born and raised in Hunza Valley. 15 years of trekking and mountaineering experience. Certified mountain guide.",
                    specialty: "Trekking & Mountaineering",
                    region: "Hunza Valley",
                    languages: "Burushaski, Urdu, English",
                    isActive: true,
                },
            },
        },
    });
    console.log(`✅ Expert: ${expert1.email} (role: ${expert1.role})`);

    const expert2 = await prisma.user.upsert({
        where: { email: "fatima.bibi@gbguide.local" },
        update: {},
        create: {
            name: "Fatima Bibi",
            email: "fatima.bibi@gbguide.local",
            passwordHash: expertPassword,
            country: "Pakistan",
            role: "EXPERT",
            expertProfile: {
                create: {
                    bio: "Cultural ambassador and professional photographer from Skardu. Dedicated to showcasing the rich heritage of Baltistan.",
                    specialty: "Cultural Tours & Photography",
                    region: "Skardu",
                    languages: "Balti, Urdu, English",
                    isActive: false,
                },
            },
        },
    });
    console.log(`✅ Expert: ${expert2.email} (role: ${expert2.role}, inactive)`);

    // ─── Client User ────────────────────────────────────
    const clientPassword = await bcrypt.hash("client123!", 12);
    const client = await prisma.user.upsert({
        where: { email: "john.doe@example.com" },
        update: {},
        create: {
            name: "John Doe",
            email: "john.doe@example.com",
            passwordHash: clientPassword,
            country: "United States",
            role: "CLIENT",
            clientProfile: {
                create: {
                    whatsappNumber: "+1 555 123 4567",
                    travelPreferences: "Trekking, Photography, Solo travel",
                },
            },
        },
    });
    console.log(`✅ Client: ${client.email} (role: ${client.role})`);

    console.log("\n✨ Seed complete!");
    console.log("\n📋 Test Credentials:");
    console.log("   Admin:  admin@gbguide.local / admin123!");
    console.log("   Expert: ahmad.khan@gbguide.local / expert123!");
    console.log("   Client: john.doe@example.com / client123!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
