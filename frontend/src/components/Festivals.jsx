import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Festivals() {
  const [showAll, setShowAll] = useState(false);
  const [live, setLive] = useState(null);

  useEffect(() => {
    fetch(`${API}/festivals/upcoming`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setLive(d.festivals || []))
      .catch(() => setLive(null));
  }, []);

  const items =
    live && live.length > 0
      ? live.map((f) => ({
          nameHi: f.name_hi,
          nameEn: f.name_en,
          hinduDate: f.hindu,
          gregorian: f.gregorian,
          deity: f.deity,
          desc: f.desc,
          daysUntil: f.days_until,
        }))
      : MANDIR_CONFIG.festivals;

  const list = showAll ? items : items.slice(0, 6);
  const isLive = live && live.length > 0;

  return (
    <section
      id="festivals"
      data-testid="festivals-section"
      className="relative py-28 px-5 sm:px-8 bg-[#0d0710]/60"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Sacred Occasions" titleHi="आगामी हिन्दू पर्व" titleEn="Upcoming Hindu Festivals" />

        {isLive && (
          <Reveal className="text-center -mt-6 mb-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 px-5 py-2 text-xs sm:text-sm text-[#f3e5ab]/80">
              🪔 पंचांग-आधारित वास्तविक तिथियाँ — दिनांक एवं तिथि स्वतः अद्यतित
            </p>
          </Reveal>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((f, i) => (
            <Reveal key={f.nameEn} delay={0.06 * i}>
              <article
                data-testid={`festival-card-${f.nameEn.toLowerCase().replace(/\s+/g, "-")}`}
                className="group glass-gold rounded-2xl p-6 h-full hover:-translate-y-1.5 hover:border-[#ff8c00]/50 hover:shadow-[0_16px_48px_rgba(255,107,0,0.12)] transition-[transform,border-color,box-shadow] duration-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                    <Sparkles size={17} />
                  </span>
                  <div className="text-right">
                    <span className="block font-dev text-sm text-[#d4af37]">{f.hinduDate}</span>
                    {f.daysUntil != null && (
                      <span
                        data-testid={`festival-countdown-${f.nameEn.toLowerCase().replace(/\s+/g, "-")}`}
                        className="mt-1.5 inline-block rounded-full bg-[#ff6b00]/15 border border-[#ff6b00]/40 px-3 py-0.5 text-[11px] font-semibold text-[#ffb877]"
                      >
                        {f.daysUntil === 0 ? "आज का पर्व" : f.daysUntil === 1 ? "कल" : `${f.daysUntil} दिनों में`}
                      </span>
                    )}
                  </div>
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
