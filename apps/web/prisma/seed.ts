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
    const ep1 = await prisma.expertProfile.findUnique({ where: { userId: expert1.id } });
    const ep2 = await prisma.expertProfile.findUnique({ where: { userId: expert2.id } });

    if (ep1 && ep2) {
        // Delete dependent records first to avoid FK constraint violations
        const existingSlots = await prisma.availabilitySlot.findMany({
            where: { expertId: { in: [ep1.id, ep2.id] } },
            select: { id: true },
        });
        const slotIds = existingSlots.map((s) => s.id);
        if (slotIds.length > 0) {
            const existingBookings = await prisma.booking.findMany({
                where: { slotId: { in: slotIds } },
                select: { id: true },
            });
            const bookingIds = existingBookings.map((b) => b.id);
            if (bookingIds.length > 0) {
                await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
                await prisma.preConsultationForm.deleteMany({ where: { bookingId: { in: bookingIds } } });
                await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
            }
        }
        await prisma.availabilitySlot.deleteMany({
            where: { expertId: { in: [ep1.id, ep2.id] } },
        });

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const slots = [];
        for (let d = 1; d <= 14; d++) {
            const date = addDays(today, d);
            const dayOfWeek = date.getUTCDay();

            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                for (const hour of [4, 6, 9, 11]) {
                    slots.push({
                        expertId: ep1.id,
                        startAt: setTime(date, hour, 0),
                        endAt: setTime(date, hour + 1, 0),
                        status: "AVAILABLE" as const,
                    });
                }
            }

            if ([1, 3, 5, 6].includes(dayOfWeek)) {
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

    // ─── Destinations ───────────────────────────────────
    await prisma.destination.deleteMany({});
    const destinations = await prisma.destination.createMany({
        data: [
            {
                title: "Hunza Valley",
                slug: "hunza-valley",
                heroImageUrl: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200",
                summary: "The crown jewel of Gilgit-Baltistan — a paradise of terraced fields, ancient forts, and jaw-dropping mountain panoramas framed by Rakaposhi and Ultar Sar.",
                content: `## Overview\n\nHunza Valley is arguably the most popular destination in all of Gilgit-Baltistan. Nestled at an altitude of 2,438 meters, this spectacular valley stretches along the Hunza River and is surrounded by some of the world's most dramatic peaks.\n\n## Top Attractions\n\n- **Karimabad** — The main town with stunning views of Rakaposhi (7,788m)\n- **Baltit Fort** — A 700-year-old heritage fort, now a museum\n- **Eagle's Nest Viewpoint** — Panoramic views of the entire valley\n- **Attabad Lake** — Turquoise lake formed by a 2010 landslide\n- **Passu Cones** — Cathedral-like rock spires and the famous suspension bridge\n\n## Getting There\n\nFly from Islamabad to Gilgit (45 min, weather-dependent) then drive 2 hours north on the Karakoram Highway. Alternatively, drive the full KKH from Islamabad (12-15 hours).\n\n## Tips\n\n- Best visited May–October for clear skies\n- Cherry blossom season (March–April) is magical\n- Carry cash — ATMs are scarce outside Karimabad`,
                region: "Hunza",
                difficulty: "EASY",
                bestSeason: "May – October",
                isPublished: true,
            },
            {
                title: "Skardu & Shangrila",
                slug: "skardu-shangrila",
                heroImageUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200",
                summary: "Gateway to the world's highest peaks — home to Shangrila Resort, Deosai Plains, and the starting point for K2 and Broad Peak expeditions.",
                content: `## Overview\n\nSkardu is the capital of Baltistan and the adventure hub of GB. At 2,228m elevation, it's the launching pad for some of the world's greatest mountaineering expeditions.\n\n## Top Attractions\n\n- **Shangrila Resort** — "Heaven on Earth" with its heart-shaped lake\n- **Upper Kachura Lake** — Crystal-clear turquoise waters surrounded by rocks\n- **Deosai National Park** — The "Land of Giants" at 4,114m, home to Himalayan brown bears\n- **Skardu Fort (Kharpocho)** — Overlooking the Indus River\n- **Satpara Lake** — Serene alpine lake near the town\n\n## Getting There\n\nFlight from Islamabad to Skardu (1 hour) or drive via Karakoram Highway + Skardu Road (18-20 hours).\n\n## Tips\n\n- Deosai is accessible only June–September\n- Book jeeps in advance for remote lakes\n- Altitude can be challenging — acclimatize gradually`,
                region: "Skardu",
                difficulty: "MODERATE",
                bestSeason: "June – September",
                isPublished: true,
            },
            {
                title: "Fairy Meadows & Nanga Parbat",
                slug: "fairy-meadows-nanga-parbat",
                heroImageUrl: "https://images.unsplash.com/photo-1623073284788-0d846f75e329?w=1200",
                summary: "A lush alpine meadow at the foot of Nanga Parbat (8,126m), the ninth-highest mountain on Earth — one of the most breathtaking campsites in the world.",
                content: `## Overview\n\nFairy Meadows is a grassland near one of the base camps of Nanga Parbat, often called the "Killer Mountain." The meadow sits at 3,300m and offers an unobstructed view of the mountain's Raikot Face.\n\n## The Trek\n\n- **Starting point**: Raikot Bridge on the Karakoram Highway\n- **Jeep ride**: A thrilling (terrifying!) 2-hour jeep ride on one of the world's most dangerous roads\n- **Hike**: 3-5 hours through pine forests to the meadows\n- **Nanga Parbat Base Camp**: Additional 3-4 hour hike from Fairy Meadows\n\n## What to Expect\n\n- Wooden huts and tent camping available\n- Stargazing is phenomenal — minimal light pollution\n- Simple meals served at local camps\n\n## Tips\n\n- Not for the faint of heart — the jeep road is extreme\n- Carry warm layers even in summer\n- Best from June to September`,
                region: "Diamer",
                difficulty: "MODERATE",
                bestSeason: "June – September",
                isPublished: true,
            },
            {
                title: "K2 Base Camp Trek",
                slug: "k2-base-camp-trek",
                heroImageUrl: "https://images.unsplash.com/photo-1614522220651-3083c30f1097?w=1200",
                summary: "The ultimate mountaineering trek — a 12-14 day journey through the Baltoro Glacier to the foot of K2 (8,611m), the world's second-highest peak.",
                content: `## Overview\n\nThe K2 Base Camp trek (also called Concordia trek) is one of the most epic high-altitude treks on Earth. It takes you through the heart of the Karakoram range with views of four 8,000m+ peaks.\n\n## Trek Details\n\n- **Duration**: 12-14 days (round trip from Skardu)\n- **Max altitude**: Concordia at 4,691m, K2 BC at 5,150m\n- **Distance**: ~160 km round trip\n- **Difficulty**: Hard — requires good fitness and high-altitude experience\n\n## Route Highlights\n\n- Askole — the last village\n- Baltoro Glacier — one of the longest glaciers outside polar regions\n- Concordia — the "Throne Room of the Mountain Gods"\n- Gondogoro Pass (optional) — 5,585m crossing\n\n## Tips\n\n- Requires a licensed guide and porters\n- Permits needed from the Pakistan government\n- Best season: June–August\n- Start training at least 3 months before`,
                region: "Skardu",
                difficulty: "HARD",
                bestSeason: "June – August",
                isPublished: true,
            },
            {
                title: "Naltar Valley",
                slug: "naltar-valley",
                heroImageUrl: "https://images.unsplash.com/photo-1600298881979-6eb4f4718a07?w=1200",
                summary: "Famous for its rainbow-colored lakes and Pakistan's only ski resort — a hidden gem just 2.5 hours from Gilgit town.",
                content: `## Overview\n\nNaltar Valley is a pristine alpine valley known for its multi-colored lakes and winter skiing. It's less crowded than Hunza or Skardu, making it perfect for travelers seeking solitude.\n\n## Top Attractions\n\n- **Naltar Lakes** — Three lakes with dramatic color changes (green, blue, white)\n- **Naltar Ski Resort** — Pakistan's premier ski destination (Dec–Mar)\n- **Pine Forests** — Dense, fragrant forests ideal for hiking\n\n## Getting There\n\nDrive from Gilgit (2.5 hours) on a jeep-only road. 4x4 vehicle required.\n\n## Tips\n\n- Military area — NOC may be required for foreigners\n- Limited accommodation — plan ahead\n- Best for lakes: June–August; Best for skiing: December–March`,
                region: "Gilgit",
                difficulty: "EASY",
                bestSeason: "June – August / Dec – March (skiing)",
                isPublished: false,
            },
            {
                title: "Khunjerab Pass",
                slug: "khunjerab-pass",
                heroImageUrl: "https://images.unsplash.com/photo-1567606404610-a4dd8c6fce21?w=1200",
                summary: "The highest paved international border crossing in the world at 4,693m — marking the China-Pakistan frontier on the Karakoram Highway.",
                content: `## Overview\n\nKhunjerab Pass sits at 4,693 meters on the Pakistan-China border. It's the highest point of the Karakoram Highway and one of the highest paved roads in the world.\n\n## What to Expect\n\n- Vast, barren landscapes with snow-capped peaks\n- Wild yaks and Marco Polo sheep sightings\n- The Pakistan-China border gate\n- Thin air — altitude sickness is common\n\n## Getting There\n\nDrive from Karimabad/Hunza (3-4 hours north) or from Sost (1.5 hours). The road is part of the KKH.\n\n## Tips\n\n- Open only May–November (closed in winter)\n- Carry warm clothing — even in summer it's cold\n- Acclimatize in Hunza before visiting\n- NOC not required for tourists staying on the highway side`,
                region: "Hunza",
                difficulty: "EASY",
                bestSeason: "May – November",
                isPublished: false,
            },
        ],
    });
    console.log(`✅ Created ${destinations.count} destinations`);

    // ─── Blog Posts ──────────────────────────────────────
    await prisma.blogPost.deleteMany({});
    const blogPosts = await prisma.blogPost.createMany({
        data: [
            {
                title: "First Timer's Guide to Hunza Valley",
                slug: "first-timers-guide-hunza-valley",
                excerpt: "Everything you need to know before visiting the most popular valley in Gilgit-Baltistan — from getting there to where to stay and what to eat.",
                coverImageUrl: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800",
                content: `## Planning Your First Trip to Hunza\n\nHunza Valley is the crown jewel of northern Pakistan. If you're planning your first visit, this guide covers everything you need to know.\n\n### Getting There\n\nThere are two main ways to reach Hunza:\n\n1. **By Air**: Fly from Islamabad to Gilgit (PIA, 45 minutes). Note: Flights are weather-dependent and frequently cancelled.\n2. **By Road**: Drive the Karakoram Highway from Islamabad (12-15 hours). The road itself is an attraction — one of the highest paved roads in the world.\n\n### Best Time to Visit\n\n- **Spring (March-April)**: Cherry and apricot blossoms transform the valley into a pink wonderland\n- **Summer (May-August)**: Clear skies, all roads open, peak tourist season\n- **Autumn (September-November)**: Golden foliage, fewer crowds, harvest festivals\n- **Winter (December-February)**: Snow-covered landscapes, very cold, limited access\n\n### Where to Stay\n\n- **Budget**: Haider Inn, Old Hunza Inn ($10-20/night)\n- **Mid-range**: Hunza Serena Inn, Darbar Hotel ($40-80/night)\n- **Luxury**: Serena Hunza, Altit Fort Heritage ($100+/night)\n\n### Must-Try Food\n\n- **Chapshoro**: Thin-crust meat pie, the signature dish\n- **Diram Fitti**: Buckwheat pancakes with walnut chutney\n- **Tumuro Tea**: Herbal tea made with a local berry\n- **Dried Apricots**: Hunza is famous for its organic apricots\n\n### Pro Tips\n\n1. Carry cash — ATMs are unreliable outside Karimabad\n2. Learn basic Urdu greetings — locals appreciate it\n3. Respect local culture — dress modestly\n4. Book a local expert through GB Guide for personalized planning`,
                status: "PUBLISHED",
                authorId: admin.id,
                publishedAt: new Date("2026-01-15"),
            },
            {
                title: "K2 Base Camp Trek: The Complete Guide",
                slug: "k2-base-camp-complete-guide",
                excerpt: "A detailed breakdown of the legendary Concordia trek — difficulty levels, costs, gear lists, daily itinerary, and insider tips from local guides.",
                coverImageUrl: "https://images.unsplash.com/photo-1614522220651-3083c30f1097?w=800",
                content: `## The Ultimate K2 Base Camp Trek Guide\n\nThe K2 Base Camp trek is often called the "trek of a lifetime." Here's everything you need to plan this epic adventure.\n\n### Overview\n\n- **Duration**: 14-18 days (round trip from Skardu)\n- **Distance**: ~160 km\n- **Max Altitude**: 5,150m (K2 Base Camp)\n- **Difficulty**: Challenging — suitable for experienced trekkers\n- **Best Season**: June to August\n\n### Estimated Costs\n\n| Item | Cost (USD) |\n|------|------------|\n| Permits & Fees | $200-300 |\n| Guide + Porters | $800-1,200 |\n| Food & Supplies | $400-600 |\n| Transport (Skardu-Askole) | $200-300 |\n| Gear Rental | $100-200 |\n| **Total** | **$1,700-2,600** |\n\n### Daily Itinerary Highlights\n\n**Days 1-2**: Skardu to Askole (jeep ride)\n**Days 3-4**: Askole to Paiju\n**Days 5-6**: Paiju to Urdukas (Baltoro Glacier begins)\n**Days 7-8**: Urdukas to Concordia — the "Throne Room"\n**Day 9**: Concordia to K2 Base Camp\n**Days 10-14**: Return journey\n\n### Essential Gear\n\n- 4-season sleeping bag (-20°C rated)\n- Insulated down jacket\n- Trekking boots (broken in!)\n- Trekking poles\n- Sunglasses (glacier glare)\n- Water purification tablets\n\n### Book a Pre-Trek Consultation\n\nOur local experts have done this trek dozens of times. Book a video consultation to get personalized advice on timing, gear, and route options.`,
                status: "PUBLISHED",
                authorId: admin.id,
                publishedAt: new Date("2026-02-01"),
            },
            {
                title: "Best Time to Visit Gilgit-Baltistan: A Month-by-Month Guide",
                slug: "best-time-visit-gilgit-baltistan",
                excerpt: "Month-by-month breakdown of weather, festivals, road conditions, and crowd levels across all major GB destinations.",
                coverImageUrl: "https://images.unsplash.com/photo-1623073284788-0d846f75e329?w=800",
                content: `## When Should You Visit GB?\n\nThe answer depends on what you want to experience. Here's a month-by-month breakdown.\n\n### March – April: Blossom Season\n- Cherry and apricot blossoms in Hunza and Nagar\n- Weather warming up but still chilly at night\n- Some roads may still be closed (Babusar, Khunjerab)\n\n### May – June: Early Summer\n- Perfect weather, roads opening\n- Hunza, Skardu, and Fairy Meadows at their best\n- Tourist season begins\n\n### July – August: Peak Season\n- All roads open, including Deosai and Khunjerab\n- Trekking season (K2 BC, Rakaposhi BC)\n- Occasional monsoon rain in lower areas\n\n### September – October: Autumn Gold\n- Foliage turns golden across all valleys\n- Fewer crowds, pleasant weather\n- Harvest season — fresh fruits and nuts\n\n### November – February: Winter\n- Heavy snow in most areas\n- Naltar skiing (December–March)\n- Limited access but magical landscapes\n- Very few tourists`,
                status: "DRAFT",
                authorId: admin.id,
            },
            {
                title: "Solo Female Travel in Gilgit-Baltistan: Safety & Tips",
                slug: "solo-female-travel-gilgit-baltistan",
                excerpt: "An honest guide to solo female travel in GB — safety concerns, cultural tips, recommended routes, and advice from women who've done it.",
                coverImageUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800",
                content: `## Is GB Safe for Solo Female Travelers?\n\nShort answer: Yes, with preparation. Here's what you need to know.\n\n### Safety Overview\n\nGilgit-Baltistan is generally very safe for tourists, including solo female travelers. The local culture is hospitable and respectful. However, like any travel destination, awareness and preparation are key.\n\n### Cultural Tips\n\n- **Dress Modestly**: Loose-fitting clothes that cover shoulders and knees\n- **Headscarf**: Not required in most tourist areas but appreciated in rural communities\n- **Respectful Photography**: Always ask before photographing locals, especially women\n\n### Recommended Routes for Solo Women\n\n1. **Hunza Valley** — Most tourist-friendly, well-connected\n2. **Skardu** — Good infrastructure, welcoming community\n3. **Fairy Meadows** — Group treks available, social atmosphere\n\n### Our Expert, Fatima Zahra\n\nFatima is our female expert from Skardu who specializes in guiding solo female travelers. Book a consultation with her for personalized, woman-to-woman advice.`,
                status: "DRAFT",
                authorId: admin.id,
            },
            {
                title: "Photography Guide: Capturing Gilgit-Baltistan",
                slug: "photography-guide-gilgit-baltistan",
                excerpt: "Best photography spots, golden hour timings, gear recommendations, and composition tips for stunning GB landscape photography.",
                coverImageUrl: "https://images.unsplash.com/photo-1600298881979-6eb4f4718a07?w=800",
                content: `## Photographing the Karakoram\n\nGB is a photographer's paradise. Here are the best spots and tips.\n\n### Top 10 Photography Locations\n\n1. **Eagle's Nest, Hunza** — Sunrise over Rakaposhi\n2. **Passu Cones** — Cathedral spires at golden hour\n3. **Attabad Lake** — Turquoise water reflections\n4. **Deosai Plains** — Wildflowers and brown bears\n5. **Concordia** — Four 8,000m peaks in one frame\n6. **Fairy Meadows** — Nanga Parbat from the meadow\n7. **Upper Kachura Lake** — Crystal-clear water and rocks\n8. **Khunjerab Pass** — Vast high-altitude landscapes\n9. **Passu Suspension Bridge** — Dramatic engineering\n10. **Baltit Fort** — Heritage architecture against peaks\n\n### Gear Recommendations\n\n- **Camera**: Full-frame mirrorless (Sony A7IV, Canon R5)\n- **Lenses**: 16-35mm wide angle, 70-200mm telephoto\n- **Tripod**: Carbon fiber (lightweight for trekking)\n- **Filters**: Polarizer and ND filters for lakes\n- **Extra batteries**: Cold drains batteries fast\n\n### Book a Photo Expedition\n\nOur expert Fatima Zahra leads photography tours across Skardu and Baltistan. Book a consultation to plan your photo trip.`,
                status: "DRAFT",
                authorId: admin.id,
            },
        ],
    });
    console.log(`✅ Created ${blogPosts.count} blog posts`);

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
