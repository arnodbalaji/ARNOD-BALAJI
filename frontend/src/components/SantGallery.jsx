import { useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import santGallery from "../config/santGallery.json";

export default function SantGallery() {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? santGallery : santGallery.slice(0, 12);

  return (
    <section
      id="sant-gallery"
      data-testid="sant-gallery-section"
      className="relative py-28 px-5 sm:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(59,9,9,0.45),transparent_75%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Sant Parampara"
          titleHi="पूज्य संत परंपरा"
          titleEn={`Divine Darshan — ${santGallery.length} चित्र`}
        />

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

        <Reveal className="mt-10 text-center">
          <button
            data-testid="view-all-sants-button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-[#d4af37]/50 px-8 py-3 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors duration-300"
          >
            {showAll ? "कम देखें" : `सभी ${santGallery.length} संत चित्र देखें`}
          </button>
        </Reveal>

        <Reveal className="mt-12 text-center">
          <p className="font-dev-body text-lg text-[#f3e5ab]/70 italic">
            “संतों के चरणों में सादर वंदन”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
