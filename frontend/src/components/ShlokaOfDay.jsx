import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Reveal } from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ShlokaOfDay() {
  const [shloka, setShloka] = useState(null);

  useEffect(() => {
    fetch(`${API}/shloka/today`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setShloka)
      .catch(() => setShloka(null));
  }, []);

  if (!shloka) return null;

  return (
    <section id="shloka" data-testid="shloka-of-day" className="relative py-16 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="glass-gold rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
            <p className="font-display text-[10px] tracking-[0.4em] uppercase text-[#d4af37]/80 flex items-center justify-center gap-2">
              <BookOpen size={13} />
              ॥ आज का श्लोक ॥
            </p>
            <p className="mt-6 font-dev text-xl sm:text-2xl leading-relaxed text-gold-gradient whitespace-pre-line">
              {shloka.sanskrit}
            </p>
            <p className="mt-5 font-dev-body text-sm sm:text-base text-[#fdfbf7]/70 leading-relaxed">
              {shloka.meaning_hi}
            </p>
            <p className="mt-5 inline-block rounded-full border border-[#d4af37]/30 px-4 py-1.5 text-xs text-[#f3e5ab]/80">
              📿 {shloka.source}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
