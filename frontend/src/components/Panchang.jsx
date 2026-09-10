import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WEEKDAYS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const Tile = ({ label, value, sub }) => (
  <div className="glass-gold rounded-2xl p-5 text-center hover:border-[#d4af37]/50 transition-colors duration-500">
    <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#d4af37]/70">{label}</p>
    <p className="mt-2 font-dev text-xl text-[#f3e5ab] leading-snug">{value}</p>
    {sub && <p className="mt-1 text-xs text-[#fdfbf7]/50">{sub}</p>}
  </div>
);

export default function Panchang() {
  const [today, setToday] = useState(null);
  const [error, setError] = useState(false);
  const now = new Date();
  const [cal, setCal] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [monthData, setMonthData] = useState(null);

  useEffect(() => {
    fetch(`${API}/panchang`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setToday)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    setMonthData(null);
    fetch(`${API}/panchang/month?year=${cal.year}&month=${cal.month}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setMonthData)
      .catch(() => setMonthData({ days: [] }));
  }, [cal]);

  const shiftMonth = (dir) =>
    setCal((c) => {
      const m = c.month + dir;
      return { year: m < 1 ? c.year - 1 : m > 12 ? c.year + 1 : c.year, month: m < 1 ? 12 : m > 12 ? 1 : m };
    });

  const cells = useMemo(() => {
    if (!monthData?.days) return [];
    const first = new Date(cal.year, cal.month - 1, 1).getDay();
    return [...Array(first).fill(null), ...monthData.days];
  }, [monthData, cal]);

  const tithiMark = (t) => {
    if (t === 14) return { dot: "bg-[#d4af37]", ring: "ring-1 ring-[#d4af37]/60", label: "पूर्णिमा" };
    if (t === 29) return { dot: "bg-[#64748b]", ring: "ring-1 ring-[#64748b]/60", label: "अमावस्या" };
    if (t === 10 || t === 25) return { dot: "bg-[#ff6b00]", ring: "ring-1 ring-[#ff6b00]/50", label: "एकादशी" };
    return null;
  };

  return (
    <section id="panchang" data-testid="panchang-section" className="relative py-28 px-5 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_85%_15%,rgba(255,107,0,0.08),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHeading eyebrow="Vedic Almanac" titleHi="पंचांग एवं हिन्दू कैलेंडर" titleEn="Panchang & Calendar" />

        {error && (
          <p data-testid="panchang-error" className="text-center text-[#ffb877]">
            पंचांग डेटा अभी उपलब्ध नहीं है। कृपया कुछ समय बाद पुनः प्रयास करें।
          </p>
        )}
        {!today && !error && (
          <div className="flex justify-center py-10 text-[#d4af37]">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {today && (
          <Reveal>
            <div data-testid="panchang-today" className="mb-16">
              <div className="text-center mb-8">
                <p className="font-dev text-2xl text-gold-gradient">
                  {today.vaar_hi} · विक्रम संवत् {today.vikram_samvat}
                </p>
                <p className="text-sm text-[#fdfbf7]/55 mt-1">
                  {today.hindu_month_hi} मास · {today.paksha_hi} · {today.tithi_hi}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Tile label="तिथि · Tithi" value={today.tithi_hi} sub={`${today.paksha_hi} · ${today.tithi}`} />
                <Tile label="नक्षत्र · Nakshatra" value={today.nakshatra_hi} sub={today.nakshatra} />
                <Tile label="योग · Yoga" value={today.yoga} />
                <Tile label="करण · Karana" value={today.karana} />
                <Tile label="मास · Month" value={today.hindu_month_hi} sub={today.hindu_month} />
                <Tile label="सूर्योदय · Sunrise" value={today.sunrise} sub="IST" />
                <Tile label="सूर्यास्त · Sunset" value={today.sunset} sub="IST" />
                <Tile
                  label="राहुकाल · Rahukaal"
                  value={`${today.rahukaal.start} – ${today.rahukaal.end}`}
                  sub="अशुभ समय"
                />
                {today.choghadiya?.length > 0 && (
                  <div className="glass-gold rounded-2xl p-5 col-span-2">
                    <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#d4af37]/70 text-center">
                      दिन चौघड़िया · Day Choghadiya
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {today.choghadiya.map((c) => (
                        <div key={c.start} className="flex justify-between text-xs">
                          <span className={c.nature === "शुभ" ? "text-[#f3e5ab]" : "text-[#fdfbf7]/50"}>
                            {c.name} <span className="text-[#ff8c00]/70">({c.nature})</span>
                          </span>
                          <span className="text-[#fdfbf7]/45">{c.start}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div data-testid="hindu-calendar" className="glass-gold rounded-3xl p-6 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <button
                data-testid="calendar-prev-month"
                onClick={() => shiftMonth(-1)}
                className="w-11 h-11 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37]/10 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-display text-lg sm:text-xl tracking-[0.2em] uppercase text-[#f3e5ab]">
                {MONTHS_EN[cal.month - 1]} {cal.year}
              </h3>
              <button
                data-testid="calendar-next-month"
                onClick={() => shiftMonth(1)}
                className="w-11 h-11 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37]/10 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {WEEKDAYS_HI.map((d) => (
                <div key={d} className="py-2 font-dev text-sm text-[#ff8c00]/80">{d}</div>
              ))}
              {cells.map((cell, i) =>
                cell === null ? (
                  <div key={`e${i}`} />
                ) : (
                  (() => {
                    const mark = tithiMark(cell.tithi_index);
                    const isToday =
                      cell.day === now.getDate() &&
                      cal.month === now.getMonth() + 1 &&
                      cal.year === now.getFullYear();
                    return (
                      <div
                        key={cell.day}
                        data-testid={isToday ? "calendar-today" : undefined}
                        className={`relative rounded-xl py-2 sm:py-3 border transition-colors duration-300 ${
                          isToday
                            ? "border-[#ff6b00] bg-[#ff6b00]/10"
                            : mark
                              ? `${mark.ring} bg-[#d4af37]/[0.04]`
                              : "border-transparent hover:bg-[#d4af37]/5"
                        }`}
                      >
                        <span className={`block text-sm sm:text-base font-medium ${isToday ? "text-[#ffb877]" : "text-[#fdfbf7]/80"}`}>
                          {cell.day}
                        </span>
                        {mark ? (
                          <span className="mt-1 flex items-center justify-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${mark.dot}`} />
                            <span className="hidden sm:block text-[9px] text-[#f3e5ab]/70">{mark.label}</span>
                          </span>
                        ) : (
                          <span className="block mt-1 text-[9px] text-[#fdfbf7]/30">{cell.tithi_hi}</span>
                        )}
                      </div>
                    );
                  })()
                )
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-[#fdfbf7]/60">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#d4af37]" /> पूर्णिमा</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#64748b]" /> अमावस्या</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff6b00]" /> एकादशी</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
