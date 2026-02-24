import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preparation & Culture — GB Guide",
    description:
        "Learn about Gilgit-Baltistan culture, etiquette, packing tips, altitude sickness prevention, and how to prepare for your trip.",
};

export default function PreparationPage() {
    return (
        <>
            <section className="section-padding bg-gradient-to-b from-primary-950/50 to-transparent">
                <div className="page-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Preparation & <span className="gradient-text">Culture</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Understand the culture, prepare for the altitude, and pack smart.
                        A well-prepared traveler has the best experience.
                    </p>
                </div>
            </section>

            <section className="section-padding !pt-0">
                <div className="page-container max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: "🎒 Packing Essentials", desc: "Layered clothing, sun protection, sturdy shoes, power bank, headlamp, and first-aid kit. Your expert will customize this for your specific trek." },
                            { title: "⛰️ Altitude Tips", desc: "GB ranges from 1,500m to 8,611m. Acclimatize slowly, stay hydrated, and know the signs of altitude sickness." },
                            { title: "🕌 Cultural Etiquette", desc: "GB is home to diverse ethnic groups and languages. Respect local customs — ask before photographing people, dress modestly, and greet warmly." },
                            { title: "🍽️ Local Cuisine", desc: "Try chapshoro (meat pie), diram fitti, salt tea, and fresh apricots. Your expert can guide you to the best local eateries." },
                            { title: "📸 Photography", desc: "Golden hour in Passu, starry skies in Deosai, reflections in Attabad Lake. Bring a wide-angle lens and extra batteries." },
                            { title: "💬 Language", desc: "Urdu is widely understood. English is spoken in tourist areas. Learning basic greetings in Burushaski or Shina will delight locals." },
                        ].map((item) => (
                            <div key={item.title} className="glass rounded-2xl p-6 hover:border-accent-400/20 transition-all">
                                <h3 className="text-lg font-heading font-semibold mb-2">{item.title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 glass rounded-xl p-6 text-center">
                        <p className="text-slate-400 text-sm">
                            🚧 <strong>TODO:</strong> Add interactive packing list generator,
                            seasonal travel calendar, and cultural do's/don'ts guide.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
