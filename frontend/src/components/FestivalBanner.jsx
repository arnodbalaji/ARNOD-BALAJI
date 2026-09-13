import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { scrollToId } from "../lib/scroll";
import { playBellOnce } from "../lib/bell";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function FestivalBanner() {
  const [next, setNext] = useState(null);

  useEffect(() => {
    fetch(`${API}/festivals/upcoming`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setNext(d.festivals?.[0] || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!next || localStorage.getItem("bell_played")) return;
    const arm = () => {
      playBellOnce();
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("scroll", arm);
    };
    window.addEventListener("pointerdown", arm);
    window.addEventListener("scroll", arm, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("scroll", arm);
    };
  }, [next]);

  if (!next) return null;

  return (
    <div className="relative px-5 sm:px-8 pt-6">
      <motion.button
        data-testid="festival-auto-banner"
        onClick={() => scrollToId("festivals")}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-2xl w-full flex items-center justify-center gap-3 rounded-full border border-[#ff8c00]/50 bg-gradient-to-r from-[#3b0909]/90 via-[#1a0303]/90 to-[#3b0909]/90 px-6 py-3.5 overflow-hidden group hover:border-[#ff8c00] transition-colors duration-300"
      >
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.18),transparent_70%)] animate-aura pointer-events-none" />
        <Sparkles size={16} className="text-[#ff8c00] shrink-0" />
        <span className="relative text-sm sm:text-base text-center">
          <span className="font-dev text-gold-gradient">🚩 आगामी पर्व: {next.name_hi}</span>
          <span className="text-[#fdfbf7]/60 ml-2 text-xs sm:text-sm">
            {next.gregorian} · {next.hindu}
          </span>
          <span className="ml-2 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#ffb877]">
            {next.days_until === 0 ? "आज" : next.days_until === 1 ? "कल" : `${next.days_until} दिनों में`}
          </span>
        </span>
      </motion.button>
    </div>
  );
}
