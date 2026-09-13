import { useState } from "react";
import { Music, Image as ImageIcon, FileText } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import Lightbox from "./Lightbox";
import { useSettings } from "../lib/useSettings";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const absUrl = (u) => (u && u.startsWith("/api") ? `${BACKEND}${u}` : u);

export default function CustomSections() {
  const settings = useSettings();
  const [selected, setSelected] = useState(null);
  const sections = settings.customSections || [];

  if (!sections.length) return null;

  return (
    <section id="mandir-media" data-testid="custom-sections" className="relative py-24 px-5 sm:px-8 bg-[#0d0710]/60">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Mandir Updates" titleHi="🛕 मंदिर मीडिया एवं अपडेट" titleEn="From The Mandir" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec, i) => (
            <Reveal key={`${sec.title}-${i}`} delay={0.05 * i}>
              <article
                data-testid={`custom-section-${i + 1}`}
                className="glass-gold rounded-2xl p-6 h-full hover:border-[#ff8c00]/50 transition-colors duration-500"
              >
                <span className="w-10 h-10 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                  {sec.type === "audio" ? <Music size={17} /> : sec.type === "image" ? <ImageIcon size={17} /> : <FileText size={17} />}
                </span>
                <h3 className="mt-4 font-dev text-xl text-[#f3e5ab]">{sec.title}</h3>
                {sec.type === "audio" && sec.url && (
                  <audio data-testid={`custom-audio-${i + 1}`} controls src={absUrl(sec.url)} className="mt-4 w-full h-10 rounded-lg" />
                )}
                {sec.type === "image" && sec.url && (
                  <img
                    src={absUrl(sec.url)}
                    alt={sec.title}
                    loading="lazy"
                    onClick={() => setSelected({ img: absUrl(sec.url), name: sec.title })}
                    className="mt-4 w-full aspect-video object-cover rounded-xl border border-[#d4af37]/25 cursor-zoom-in hover:scale-[1.02] transition-transform duration-500"
                  />
                )}
                {sec.text && (
                  <p className="mt-3 text-sm leading-relaxed text-[#fdfbf7]/60 whitespace-pre-line">{sec.text}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox src={selected?.img} alt={selected?.name} onClose={() => setSelected(null)} />
    </section>
  );
}
