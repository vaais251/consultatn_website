import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function setTime(date: Date, hours: number, minutes: number): Date {
    const d = new Date(date);
    d.setUTCHours(hours, minutes, 0, 0);
    return d;
}

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
    console.log(`✅ Admin: ${admin.email}`);

    // ─── Expert 1: Ahmad Khan ───────────────────────────
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
                    bio: "Born and raised in Hunza Valley with over 15 years of trekking and mountaineering experience. Ahmad has summited multiple 7,000m+ peaks and has guided hundreds of international trekkers through the Karakoram Highway, Rakaposhi Base Camp, and the legendary Baltoro Glacier trek. He is a certified mountain guide recognized by the Alpine Club of Pakistan.",
                    specialty: "Trekking & Mountaineering",
                    region: "Hunza Valley",
                    languages: "Burushaski, Urdu, English, Mandarin (basic)",
                    credentials: "Certified Mountain Guide (Alpine Club of Pakistan), First Aid Certified, 15+ years experience",
                    hourlyRate: 45,
                    isActive: true,
                },
            },
        },
    });
    console.log(`✅ Expert: ${expert1.email}`);

    const expert2 = await prisma.user.upsert({
        where: { email: "fatima.bibi@gbguide.local" },
        update: {},
        create: {
            name: "Fatima Zahra",
            email: "fatima.bibi@gbguide.local",
            passwordHash: expertPassword,
            country: "Pakistan",
            role: "EXPERT",
            expertProfile: {
                create: {
                    bio: "Cultural ambassador and professional photographer from Skardu with deep roots in Baltistan. Fatima specializes in cultural immersion tours, local cuisine experiences, and photography expeditions across Shangrila, Deosai National Park, and Upper Kachura. She has been featured in National Geographic Traveller and hosts cultural workshops for foreign visitors.",
                    specialty: "Cultural Tours & Photography",
                    region: "Skardu & Baltistan",
                    languages: "Balti, Urdu, English, French",
                    credentials: "Tourism Ambassador (GB Tourism Board), Published Photographer (National Geographic), Cultural Workshop Host",
                    hourlyRate: 55,
                    isActive: true,
                },
            },
        },
    });
    console.log(`✅ Expert: ${expert2.email}`);

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
    console.log(`✅ Client: ${client.email}`);

    // ─── Availability Slots ─────────────────────────────
    // Get expert profiles
    const ep1 = await prisma.expertProfile.findUnique({ where: { userId: expert1.id } });
    const ep2 = await prisma.expertProfile.findUnique({ where: { userId: expert2.id } });

    if (ep1 && ep2) {
        // Delete existing slots to avoid duplicates on re-seed
        await prisma.availabilitySlot.deleteMany({
            where: { expertId: { in: [ep1.id, ep2.id] } },
        });

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const slots = [];
        // Create slots for the next 14 days
        for (let d = 1; d <= 14; d++) {
            const date = addDays(today, d);
            const dayOfWeek = date.getUTCDay();

            // Skip weekends for Expert 1
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Ahmad: 9am, 11am, 2pm, 4pm (UTC+5 → 4am, 6am, 9am, 11am UTC)
                for (const hour of [4, 6, 9, 11]) {
                    slots.push({
                        expertId: ep1.id,
                        startAt: setTime(date, hour, 0),
                        endAt: setTime(date, hour + 1, 0),
                        status: "AVAILABLE" as const,
                    });
                }
            }

            // Fatima: Mon/Wed/Fri/Sat
            if ([1, 3, 5, 6].includes(dayOfWeek)) {
                // Fatima: 10am, 1pm, 3pm (UTC+5 → 5am, 8am, 10am UTC)
                for (const hour of [5, 8, 10]) {
                    slots.push({
                        expertId: ep2.id,
                        startAt: setTime(date, hour, 0),
                        endAt: setTime(date, hour + 1, 0),
                        status: "AVAILABLE" as const,
                    });
                }
            }
        }

        await prisma.availabilitySlot.createMany({ data: slots });
        console.log(`✅ Created ${slots.length} availability slots`);
    }

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
