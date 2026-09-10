import { Youtube, Instagram, Play, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

export function YouTubeSection() {
  return (
    <section id="youtube" data-testid="youtube-section" className="relative py-24 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeading eyebrow="Bhakti Videos" titleHi="🙏 Bhakti & Aarti on YouTube" titleEn="" />
        <Reveal>
          <a
            data-testid="youtube-channel-card"
            href={MANDIR_CONFIG.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block glass-gold rounded-3xl p-8 sm:p-12 hover:border-red-500/40 transition-colors duration-500"
          >
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <span className="w-20 h-20 rounded-2xl bg-red-600/15 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform duration-300">
                <Youtube size={36} />
              </span>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-dev text-2xl text-[#f3e5ab]">मंदिर YouTube चैनल</h3>
                <p className="mt-2 text-sm text-[#fdfbf7]/60 leading-relaxed">
                  आरती, भजन एवं मंदिर के कार्यक्रमों के वीडियो देखें। नवीनतम वीडियो हेतु चैनल पर जाएँ।
                </p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 text-xs text-[#d4af37]/80">
                  {["Aarti Videos", "Bhajan", "Temple Events", "Latest Videos"].map((t) => (
                    <span key={t} className="rounded-full border border-[#d4af37]/25 px-3 py-1">{t}</span>
                  ))}
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white group-hover:bg-red-500 transition-colors">
                <Play size={15} />
                Visit Channel
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const items = [
    { title: "Live Darshan", desc: "आरती के लाइव प्रसारण की सूचना" },
    { title: "Aarti Updates", desc: "दैनिक आरती एवं दर्शन अपडेट" },
    { title: "Festival Updates", desc: "पर्वों एवं विशेष कार्यक्रमों की जानकारी" },
    { title: "Temple Announcements", desc: "मंदिर की आधिकारिक घोषणाएँ" },
  ];
  return (
    <section id="instagram" data-testid="instagram-section" className="relative py-24 px-5 sm:px-8 bg-[#0d0710]/60">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Social" titleHi="📿 Connect With Us" titleEn="Instagram" />
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={0.05 * i}>
              <div className="glass-gold rounded-2xl p-6 flex items-center gap-4 hover:border-[#ff8c00]/40 transition-colors duration-500">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b00]/25 to-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#ffb877]">
                  <Instagram size={19} />
                </span>
                <div>
                  <h4 className="font-semibold text-[#f3e5ab]">{it.title}</h4>
                  <p className="text-sm text-[#fdfbf7]/55">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <a
            data-testid="instagram-profile-button"
            href={MANDIR_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-8 py-3.5 font-semibold text-[#1a0303] hover:shadow-[0_0_32px_rgba(255,107,0,0.45)] transition-shadow duration-300"
          >
            Follow on Instagram
            <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
