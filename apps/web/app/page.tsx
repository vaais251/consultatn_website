import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import Hero from "@/app/components/Hero";
import { Section, TrustChips, CTASection } from "@/app/components/Section";
import TestimonialSection from "@/app/components/TestimonialSection";
import { images, brand } from "@/app/config/images";

export const metadata: Metadata = {
  title: "The North Route — Expert Travel Consultancy for Gilgit-Baltistan",
  description: "Plan your dream trip to Gilgit-Baltistan with verified local experts. Video consultations, custom itineraries, and insider knowledge for K2, Hunza, Skardu, and beyond.",
  openGraph: {
    title: "The North Route — Expert Travel Consultancy for Gilgit-Baltistan",
    description: "Plan your dream trip to Gilgit-Baltistan with verified local experts.",
    type: "website",
    siteName: "thenorthroute",
  },
};

export default async function Home() {
  const [destinations, posts, expertCount] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true, summary: true, heroImageUrl: true, region: true, difficulty: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      take: 2,
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true },
    }),
    prisma.expertProfile.count({ where: { isActive: true } }),
  ]);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────── */}
      <Hero
        backgroundImage={images.homeHero}
        title={
          <>
            Plan the North
            <span className="gradient-text block">like a local.</span>
          </>
        }
        subtitle={brand.description}
        primaryCta={{ label: "Book a Consultation", href: "/experts" }}
        secondaryCta={{ label: "Explore Destinations", href: "/destinations" }}
        badges={["Verified Local Experts", "Secure Payments", "Tailored Itineraries"]}
      />

      {/* ─── Trust Bar ────────────────────────────────── */}
      <TrustChips items={[
        { icon: "🏔️", label: "Verified Experts", value: `${expertCount}+` },
        { icon: "🎥", label: "Video Consultations" },
        { icon: "⭐", label: "Personalized Plans" },
        { icon: "🛡️", label: "Secure Payments" },
      ]} />

      {/* ─── How It Works ─────────────────────────────── */}
      <Section
        eyebrow="How It Works"
        title={<>Three steps to your <span className="gradient-text">perfect trip</span></>}
        subtitle="Connect with a local expert, get a custom plan, and travel with total confidence."
        centered
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: "01", title: "Choose Your Expert", desc: "Browse verified local experts by specialty and region. Read their bios, credentials, and reviews.", icon: "🔍" },
            { step: "02", title: "Book a Session", desc: "Select a time slot, fill in your travel preferences, and make a secure payment.", icon: "📅" },
            { step: "03", title: "Get Expert Advice", desc: "Join your video consultation — receive personalized itineraries, insider tips, and answers to all your questions.", icon: "🎯" },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl p-8 text-center group transition-all duration-300 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-16 h-16 rounded-2xl bg-accent-400/10 flex items-center justify-center text-2xl mx-auto mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-accent-500 tracking-widest mb-2">{item.step}</div>
              <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Featured Destinations ────────────────────── */}
      {destinations.length > 0 && (
        <Section
          eyebrow="Destinations"
          title={<>Featured <span className="gradient-text">Destinations</span></>}
          subtitle="Explore the most stunning places in Gilgit-Baltistan."
        >
          <div className="flex justify-end -mt-8 mb-6">
            <Link href="/destinations" className="text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors hidden md:block">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="rounded-2xl overflow-hidden group transition-all duration-300 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1"
                style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="h-52 relative overflow-hidden">
                  {dest.heroImageUrl ? (
                    <img src={dest.heroImageUrl} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center text-5xl">🏔️</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {dest.difficulty && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${dest.difficulty === "EASY" ? "bg-emerald-500/20 text-emerald-400" : dest.difficulty === "HARD" ? "bg-red-500/20 text-red-400" : "bg-accent-500/20 text-accent-400"}`}>
                      {dest.difficulty}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white/80 text-xs">📍 {dest.region}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-accent-500 transition-colors">{dest.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm line-clamp-2">{dest.summary}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 md:hidden">
            <Link href="/destinations" className="text-accent-500 text-sm font-medium">View All Destinations →</Link>
          </div>
        </Section>
      )}

      {/* ─── Latest from Blog ─────────────────────────── */}
      {posts.length > 0 && (
        <Section
          eyebrow="Blog"
          title={<>Latest from the <span className="gradient-text">Blog</span></>}
          subtitle="Travel tips and stories from our experts."
        >
          <div className="flex justify-end -mt-8 mb-6">
            <Link href="/blog" className="text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors hidden md:block">
              Read More →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 border border-[var(--border)] hover:border-accent-400/30 hover:-translate-y-1"
                style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
              >
                {post.coverImageUrl && (
                  <div className="h-52 overflow-hidden">
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5 flex-1">
                  {post.publishedAt && (
                    <span className="text-xs text-[var(--text-muted)] mb-2 block">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-accent-500 transition-colors">{post.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ─── Testimonials ─────────────────────────────── */}
      <TestimonialSection
        title="Trusted by Travelers"
        subtitle="See what adventurers from around the world say about their experience."
      />

      {/* ─── CTA Banner ───────────────────────────────── */}
      <CTASection
        backgroundImage={images.ctaBanner}
        title="Ready for the Adventure of a Lifetime?"
        subtitle="Your perfect trip to Gilgit-Baltistan is one conversation away. Connect with a local expert today."
        cta={{ label: "Start Planning Now", href: "/experts" }}
      />
    </>
  );
}
