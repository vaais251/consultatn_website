import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-primary-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.08),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,92,248,0.1),_transparent_60%)]" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-400/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        {/* Mountain silhouette overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />

        {/* Content */}
        <div className="relative z-10 page-container text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-accent-400 font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Trusted by travelers from 30+ countries
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
            Plan{" "}
            <span className="gradient-text">Gilgit-Baltistan</span>
            <br />
            with Local Experts
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up-delay text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Book a paid video consultation. Get a custom itinerary.
            <br className="hidden sm:block" /> Travel with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/about" className="btn-accent text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Explore Experts
            </Link>
            <Link href="/services" className="btn-primary text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Book a Consultation
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up-delay-2 mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Local Experts
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Payments (USD)
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Custom Itineraries
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Stats ─────────────────────────────────── */}
      <section className="relative z-10 -mt-8">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass rounded-2xl p-6 md:p-8">
            {[
              { value: "50+", label: "Local Experts" },
              { value: "1,200+", label: "Travelers Guided" },
              { value: "4.9★", label: "Average Rating" },
              { value: "30+", label: "Countries Served" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-14">
            Three simple steps to plan your perfect Gilgit-Baltistan trip
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Expert",
                desc: "Browse verified local guides by specialty — trekking, cultural tours, mountaineering, photography, or family travel.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Book a Video Call",
                desc: "Select a time from their live calendar. Fill a short form so they can prepare. Pay securely in USD.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Travel with Confidence",
                desc: "Get a custom itinerary, insider tips, and ongoing support. Your expert becomes your trusted travel partner.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass rounded-2xl p-8 text-center hover:border-accent-400/20 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400/10 to-accent-500/10 flex items-center justify-center mx-auto mb-6 text-accent-400 group-hover:from-accent-400/20 group-hover:to-accent-500/20 transition-all">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-accent-400 tracking-widest uppercase mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 p-10 md:p-16 text-center border border-primary-800/30">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Explore the{" "}
              <span className="gradient-text">Roof of the World</span>?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Connect with a verified local expert today and start planning your
              unforgettable Gilgit-Baltistan adventure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/services" className="btn-accent px-8 py-4 text-base">
                View Pricing & Plans
              </Link>
              <Link href="/contact" className="btn-outline px-8 py-4 text-base">
                Have Questions? Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
