import { Sunrise, Bell, Landmark, Sunset, Moon, Info } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

const ICONS = { sunrise: Sunrise, bell: Bell, temple: Landmark, sunset: Sunset, moon: Moon };

export default function Schedule() {
  return (
    <section
      id="schedule"
      data-testid="schedule-section"
      className="relative py-28 px-5 sm:px-8 bg-[#0d0710]/60"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading eyebrow="Daily Rituals" titleHi="मंदिर दैनिक कार्यक्रम" titleEn="Mandir Schedule" />

        <div className="relative">
          <span className="absolute left-[27px] sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#ff6b00]/30 to-transparent" />
          <div className="space-y-8">
            {MANDIR_CONFIG.schedule.map((item, i) => {
              const Icon = ICONS[item.icon] || Bell;
              const left = i % 2 === 0;
              return (
                <Reveal key={item.titleEn} delay={0.06 * i}>
                  <div
                    data-testid={`schedule-item-${i + 1}`}
                    className={`relative flex sm:w-1/2 ${left ? "sm:pr-12" : "sm:ml-auto sm:pl-12"} pl-16 sm:pl-0`}
                  >
                    <span className="sm:hidden absolute left-4 top-6 w-3.5 h-3.5 rounded-full bg-[#ff6b00] shadow-[0_0_16px_rgba(255,107,0,0.7)]" />
                    <span
                      className={`hidden sm:block absolute top-6 w-3.5 h-3.5 rounded-full bg-[#ff6b00] shadow-[0_0_16px_rgba(255,107,0,0.7)] ${
                        left ? "-right-[7px]" : "-left-[7px]"
                      }`}
                    />
                    <div className="glass-gold rounded-2xl p-6 w-full hover:border-[#d4af37]/50 transition-colors duration-500">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                          <Icon size={18} />
                        </span>
                        <div>
                          <h3 className="font-dev text-xl text-[#f3e5ab]">{item.titleHi}</h3>
                          <p className="font-display text-[10px] tracking-[0.25em] uppercase text-[#fdfbf7]/45">
                            {item.titleEn}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 font-semibold text-[#ffb877]">{item.time}</p>
                      <p className="mt-1 text-sm text-[#fdfbf7]/55">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-14">
          <div
            data-testid="schedule-notice"
            className="flex items-center justify-center gap-3 rounded-full border border-[#d4af37]/25 bg-[#d4af37]/5 px-6 py-3.5 text-center"
          >
            <Info size={16} className="text-[#d4af37] shrink-0" />
            <p className="font-dev-body text-sm sm:text-base text-[#f3e5ab]/85">
              {MANDIR_CONFIG.scheduleNotice}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
