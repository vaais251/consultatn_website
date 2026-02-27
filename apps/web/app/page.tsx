import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export const metadata: Metadata = {
  title: "GB Guide — Expert Travel Consultancy for Gilgit-Baltistan",
  description: "Plan your dream trip to Gilgit-Baltistan with verified local experts. Video consultations, custom itineraries, and insider knowledge for K2, Hunza, Skardu, and beyond.",
  openGraph: {
    title: "GB Guide — Expert Travel Consultancy for Gilgit-Baltistan",
    description: "Plan your dream trip to Gilgit-Baltistan with verified local experts.",
    type: "website",
  },
};

export default async function Home() {
  // Fetch featured content
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
      {/* ─── Hero Section ──────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-primary-950/30 to-navy-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 page-container py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-accent-400 mb-8 animate-fade-in-up">
              🏔️ Verified Local Experts from Gilgit-Baltistan
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] mb-6 animate-fade-in-up">
              Your Journey to the
              <span className="gradient-text block">Roof of the World</span>
              Starts Here
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl animate-fade-in-up-delay">
              Book 1-on-1 video consultations with verified local experts.
              Get personalized itineraries, insider tips, and real-time guidance
              for your Gilgit-Baltistan adventure.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
              <Link href="/experts" className="btn-accent !py-4 !px-8 text-base">
                Find Your Expert
              </Link>
              <Link href="/destinations" className="btn-outline !py-4 !px-8 text-base">
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Bar ─────────────────────────────────── */}
      <section className="py-6 border-y border-white/5">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-accent-400 font-bold text-lg">{expertCount}+</span>
              Verified Experts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-400 font-bold text-lg">🎥</span>
              Video Consultations
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-400 font-bold text-lg">⭐</span>
              Personalized Plans
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-400 font-bold text-lg">🛡️</span>
              Secure Payments
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            How <span className="gradient-text">GB Guide</span> Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12">
            Three simple steps to plan your perfect trip with a local expert.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Choose Your Expert", desc: "Browse verified local experts by specialty and region. Read their bios, credentials, and reviews.", icon: "🔍" },
              { step: "02", title: "Book a Session", desc: "Select a time slot, fill in your travel preferences, and make a secure payment.", icon: "📅" },
              { step: "03", title: "Get Expert Advice", desc: "Join your video consultation — receive personalized itineraries, insider tips, and answers to all your questions.", icon: "🎯" },
            ].map((item) => (
              <div key={item.step} className="glass rounded-2xl p-8 text-center group hover:border-accent-400/20 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-accent-400/10 flex items-center justify-center text-2xl mx-auto mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-accent-400 tracking-widest mb-2">{item.step}</div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Destinations ─────────────────────── */}
      {destinations.length > 0 && (
        <section className="section-padding !pt-0">
          <div className="page-container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-2">
                  Featured <span className="gradient-text">Destinations</span>
                </h2>
                <p className="text-slate-400">Explore the most stunning places in Gilgit-Baltistan.</p>
              </div>
              <Link href="/destinations" className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors hidden md:block">
                View All →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="glass rounded-2xl overflow-hidden group hover:border-accent-400/20 transition-all"
                >
                  <div className="h-48 relative overflow-hidden">
                    {dest.heroImageUrl ? (
                      <img src={dest.heroImageUrl} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-800/50 to-navy-900/50 flex items-center justify-center text-5xl">🏔️</div>
                    )}
                    {dest.difficulty && (
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${dest.difficulty === "EASY" ? "bg-emerald-500/20 text-emerald-400" : dest.difficulty === "HARD" ? "bg-red-500/20 text-red-400" : "bg-accent-500/20 text-accent-400"}`}>
                        {dest.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-accent-400 transition-colors">{dest.title}</h3>
                    <p className="text-slate-500 text-sm mb-2">📍 {dest.region}</p>
                    <p className="text-slate-400 text-sm line-clamp-2">{dest.summary}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 md:hidden">
              <Link href="/destinations" className="text-accent-400 text-sm font-medium">View All Destinations →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest from Blog ──────────────────────────── */}
      {posts.length > 0 && (
        <section className="section-padding !pt-0">
          <div className="page-container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-2">
                  Latest from the <span className="gradient-text">Blog</span>
                </h2>
                <p className="text-slate-400">Travel tips and stories from our experts.</p>
              </div>
              <Link href="/blog" className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors hidden md:block">
                Read More →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="glass rounded-2xl overflow-hidden flex flex-col group hover:border-accent-400/20 transition-all"
                >
                  {post.coverImageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    {post.publishedAt && (
                      <span className="text-xs text-slate-500 mb-2 block">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                    <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-accent-400 transition-colors">{post.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Banner ────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready for the Adventure of a Lifetime?
              </h2>
              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
                Your perfect trip to Gilgit-Baltistan is one conversation away.
                Connect with a local expert today.
              </p>
              <Link href="/experts" className="btn-accent !py-4 !px-10 text-lg">
                Start Planning Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
