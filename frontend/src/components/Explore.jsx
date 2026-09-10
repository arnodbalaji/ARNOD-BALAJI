import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

export default function Explore() {
  return (
    <section id="explore" data-testid="explore-section" className="relative py-28 px-5 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_20%,rgba(59,9,9,0.45),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHeading eyebrow="Explore Mandir" titleHi="मंदिर दर्शन एवं परिचय" titleEn="The Sacred Abode" />

        <Reveal className="max-w-3xl mx-auto text-center mb-20">
          <p className="font-dev-body text-base sm:text-lg leading-relaxed text-[#fdfbf7]/75">
            {MANDIR_CONFIG.exploreIntro}
          </p>
        </Reveal>

        <div className="space-y-0">
          {MANDIR_CONFIG.exploreChapters.map((ch, i) => (
            <Reveal key={ch.titleEn} delay={0.05 * i}>
              <div
                data-testid={`explore-chapter-${i + 1}`}
                className="group grid sm:grid-cols-[110px_1fr_auto] gap-4 sm:gap-8 items-center py-8 border-t border-[#d4af37]/12 hover:bg-[#d4af37]/[0.04] px-4 -mx-4 rounded-xl transition-colors duration-500"
              >
                <span className="font-display text-3xl sm:text-4xl text-[#d4af37]/35 group-hover:text-[#ff8c00]/80 transition-colors duration-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-dev text-2xl text-[#f3e5ab] group-hover:text-gold-gradient transition-colors duration-300">
                    {ch.titleHi}
                    <span className="ml-3 font-display text-[11px] tracking-[0.3em] uppercase text-[#fdfbf7]/40 align-middle">
                      {ch.titleEn}
                    </span>
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#fdfbf7]/60 max-w-2xl">
                    {ch.text}
                  </p>
                </div>
                <span className="hidden sm:block text-[#d4af37]/40 group-hover:text-[#ff8c00] group-hover:translate-x-1 transition-[transform,color] duration-300 text-xl">
                  →
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 grid sm:grid-cols-3 gap-6">
          {[MANDIR_CONFIG.images.murti, MANDIR_CONFIG.images.sant1, MANDIR_CONFIG.images.sant2].map(
            (src, i) => (
              <div
                key={i}
                data-testid={`explore-image-card-${i + 1}`}
                className={`overflow-hidden rounded-2xl gold-frame ${
                  i === 0 ? "sm:row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt="Mandir darshan"
                  loading="lazy"
                  className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )
          )}
        </Reveal>
      </div>
    </section>
  );
}
