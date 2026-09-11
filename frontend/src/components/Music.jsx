import { ArrowUpRight } from "lucide-react";
import BrandIcon from "./BrandIcon";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

export default function MusicSection() {
  return (
    <section id="music" data-testid="music-section" className="relative py-24 px-5 sm:px-8 bg-[#0d0710]/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,rgba(212,175,55,0.06),transparent_75%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <SectionHeading eyebrow="Devotional Music" titleHi="🎵 भजन एवं भक्ति संगीत" titleEn="Listen on Every Platform" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MANDIR_CONFIG.musicLinks.map((link, i) => (
            <Reveal key={link.label} delay={0.05 * i}>
              <a
                data-testid={`music-link-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-gold rounded-2xl p-5 sm:p-6 h-full flex flex-col gap-4 hover:-translate-y-1.5 hover:border-[#ff8c00]/50 hover:shadow-[0_14px_40px_rgba(255,107,0,0.12)] transition-[transform,border-color,box-shadow] duration-500"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-white/[0.06] border border-[#d4af37]/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcon brand={link.brand} size={18} />
                  </span>
                  <ArrowUpRight size={15} className="text-[#d4af37]/40 group-hover:text-[#ff8c00] transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#f3e5ab] text-sm sm:text-base">{link.label}</h3>
                  <p className="mt-1 text-xs text-[#fdfbf7]/50">{link.sub}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="font-dev-body text-sm text-[#f3e5ab]/60">
            🙏 बालाजी महाराज के भजन अब हर प्लेटफ़ॉर्म पर — कहीं भी, कभी भी सुनें
          </p>
        </Reveal>
      </div>
    </section>
  );
}
