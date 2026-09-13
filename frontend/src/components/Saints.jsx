import { useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";
import santGallery from "../config/santGallery.json";

export default function Saints() {
  return (
    <section
      id="saints"
      data-testid="saints-section"
      className="relative py-28 px-5 sm:px-8 bg-[#0d0710]/60 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_60%,rgba(59,9,9,0.5),transparent_75%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <SectionHeading eyebrow="संतों का आशीर्वाद" titleHi="संत दर्शन" titleEn="Blessings of Saints" />

        <div className="grid md:grid-cols-2 gap-10">
          {MANDIR_CONFIG.sants.map((sant, i) => (
            <Reveal key={sant.imageKey} delay={0.12 * i}>
              <figure
                data-testid={`sant-card-${i + 1}`}
                className="group relative rounded-3xl overflow-hidden gold-frame"
              >
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,140,0,0.18),transparent_60%)] blur-2xl pointer-events-none" />
                <img
                  src={MANDIR_CONFIG.images[sant.imageKey]}
                  alt={sant.name}
                  loading="lazy"
                  className="relative w-full h-[420px] sm:h-[480px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0303]/90 via-transparent to-transparent pointer-events-none" />
                <figcaption className="absolute bottom-0 inset-x-0 p-7 text-center">
                  <p className="font-dev text-2xl text-gold-gradient leading-snug">{sant.name}</p>
                  <p className="mt-2 font-dev-body text-sm text-[#f3e5ab]/75">{sant.title}</p>
                  <p className="mt-3 text-[#ff8c00] text-sm">॥ ॐ ॥</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="text-center mb-10">
            <h3 className="font-dev text-2xl sm:text-3xl text-gold-gradient">पूज्य संत परंपरा</h3>
            <p className="mt-2 text-sm text-[#fdfbf7]/50">
              महापुरुषों एवं संतों के दिव्य दर्शन — {santGallery.length} चित्र
            </p>
          </div>
          <SantGalleryGrid />
        </Reveal>

        <Reveal className="mt-14 text-center">
          <p className="font-dev-body text-lg text-[#f3e5ab]/70 italic">
            “संतों के चरणों में सादर वंदन”
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function SantGalleryGrid() {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? santGallery : santGallery.slice(0, 12);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {list.map((sant, i) => (
          <Reveal key={sant.img} delay={Math.min(i, 8) * 0.04}>
            <figure
              data-testid={`sant-gallery-${i + 1}`}
              className="group relative rounded-2xl overflow-hidden border border-[#d4af37]/30 hover:border-[#ff8c00]/60 hover:shadow-[0_10px_36px_rgba(255,107,0,0.15)] transition-[border-color,box-shadow] duration-500"
            >
              <img
                src={sant.img}
                alt={sant.name}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0303]/90 via-transparent to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-0 inset-x-0 p-3 text-center">
                <p className="font-dev-body text-xs sm:text-sm text-[#f3e5ab] leading-snug">
                  {sant.name}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button
          data-testid="view-all-sants-button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-full border border-[#d4af37]/50 px-8 py-3 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors duration-300"
        >
          {showAll ? "कम देखें" : `सभी ${santGallery.length} संत चित्र देखें`}
        </button>
      </div>
    </>
  );
}
