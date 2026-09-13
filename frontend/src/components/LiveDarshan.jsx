import { Instagram, ArrowRight, Radio } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";
import { useSettings } from "../lib/useSettings";

export default function LiveDarshan() {
  const settings = useSettings();
  const live = MANDIR_CONFIG.liveDarshan;
  const isLive = settings.live?.isLive ?? live.isLive;
  const igUrl = settings.links?.instagram || MANDIR_CONFIG.instagramUrl;

  return (
    <section id="live-darshan" data-testid="live-darshan-section" className="relative py-28 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,9,9,0.55),transparent_75%)] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <SectionHeading eyebrow="Live Darshan" titleHi="लाइव दर्शन एवं आरती" titleEn="Live Aarti Darshan" />

        <Reveal>
          <div
            data-testid="live-darshan-card"
            className="glass-gold rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff6b00]/15 blur-3xl pointer-events-none" />

              {isLive ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-live-dot" />
                  <span className="font-display tracking-[0.4em] uppercase text-red-400 text-sm">
                    {live.liveLabel}
                  </span>
                </div>
                <h3 className="mt-6 font-dev text-3xl sm:text-4xl text-gold-gradient">
                  🔴 LIVE DARSHAN
                </h3>
                <p className="mt-4 text-[#fdfbf7]/70">{live.liveMessage}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3">
                  <Radio size={18} className="text-[#d4af37]" />
                  <span className="font-display tracking-[0.4em] uppercase text-[#d4af37] text-sm">
                    Aarti Darshan
                  </span>
                </div>
                <h3 className="mt-6 font-dev text-3xl sm:text-4xl text-gold-gradient">
                  आरती के लाइव दर्शन
                </h3>
                <p className="mt-4 text-[#fdfbf7]/70 max-w-md mx-auto">{live.offlineMessage}</p>
              </>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                data-testid="watch-live-instagram-button"
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-8 py-3.5 font-semibold text-[#1a0303] hover:shadow-[0_0_32px_rgba(255,107,0,0.5)] hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300"
              >
                <Instagram size={17} />
                {live.isLive ? "Watch Live on Instagram" : "Watch Live on Instagram"}
                <ArrowRight size={15} />
              </a>
              <a
                data-testid="follow-instagram-button"
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#d4af37]/50 px-8 py-3.5 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 transition-colors duration-300"
              >
                Follow us on Instagram
              </a>
            </div>

            <p className="mt-8 text-xs text-[#fdfbf7]/40">
              Live प्रसारण Instagram पर होता है — बटन दबाकर सीधे जुड़ें।
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
