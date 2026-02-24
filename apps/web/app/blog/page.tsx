import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Travel Blog — GB Guide",
    description:
        "Stories, tips, and guides from travelers and local experts about exploring Gilgit-Baltistan, Pakistan.",
};

export default function BlogPage() {
    const posts = [
        { title: "First Timer's Guide to Hunza Valley", date: "Coming Soon", excerpt: "Everything you need to know before visiting the most popular valley in GB." },
        { title: "K2 Base Camp Trek: What to Expect", date: "Coming Soon", excerpt: "A detailed breakdown of the trek — difficulty, cost, gear, and timeline." },
        { title: "Best Time to Visit Gilgit-Baltistan", date: "Coming Soon", excerpt: "Month-by-month guide to weather, festivals, and crowd levels across GB." },
    ];

    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Travel <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Stories from the mountains — expert tips, traveler tales, and
                        insider knowledge about Gilgit-Baltistan.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <article key={post.title} className="glass rounded-2xl p-6 hover:border-accent-400/20 transition-all cursor-pointer group">
                                <div className="text-xs text-accent-400 font-medium mb-2">{post.date}</div>
                                <h2 className="text-xl font-heading font-semibold mb-2 group-hover:text-accent-400 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed">{post.excerpt}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Integrate CMS / WYSIWYG editor for blog
                            posts. Add categories, search, and expert-authored content.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
