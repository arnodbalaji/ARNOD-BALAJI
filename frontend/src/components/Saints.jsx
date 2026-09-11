import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

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

        <Reveal className="mt-14 text-center">
          <p className="font-dev-body text-lg text-[#f3e5ab]/70 italic">
            “संतों के चरणों में सादर वंदन”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
