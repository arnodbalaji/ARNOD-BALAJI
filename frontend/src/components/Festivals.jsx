import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

export default function Festivals() {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? MANDIR_CONFIG.festivals : MANDIR_CONFIG.festivals.slice(0, 6);

  return (
    <section
      id="festivals"
      data-testid="festivals-section"
      className="relative py-28 px-5 sm:px-8 bg-[#0d0710]/60"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Sacred Occasions" titleHi="आगामी हिन्दू पर्व" titleEn="Upcoming Hindu Festivals" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((f, i) => (
            <Reveal key={f.nameEn} delay={0.06 * i}>
              <article
                data-testid={`festival-card-${f.nameEn.toLowerCase().replace(/\s+/g, "-")}`}
                className="group glass-gold rounded-2xl p-6 h-full hover:-translate-y-1.5 hover:border-[#ff8c00]/50 hover:shadow-[0_16px_48px_rgba(255,107,0,0.12)] transition-[transform,border-color,box-shadow] duration-500"
              >
                <div className="flex items-start justify-between">
                  <span className="w-10 h-10 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                    <Sparkles size={17} />
                  </span>
                  <span className="font-dev text-sm text-[#d4af37]">{f.hinduDate}</span>
                </div>
                <h3 className="mt-5 font-dev text-2xl text-[#f3e5ab]">{f.nameHi}</h3>
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#fdfbf7]/45 mt-1">
                  {f.nameEn}
                </p>
                <p className="mt-3 text-xs font-semibold text-[#ffb877]">{f.gregorian}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#fdfbf7]/60">{f.desc}</p>
                <p className="mt-4 text-xs text-[#d4af37]/70">🙏 {f.deity}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <button
            data-testid="view-all-festivals-button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-[#d4af37]/50 px-8 py-3 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors duration-300"
          >
            {showAll ? "कम देखें" : "View All Festivals"}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
