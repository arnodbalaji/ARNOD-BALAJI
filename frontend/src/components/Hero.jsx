import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Landmark, HandMetal } from "lucide-react";
import MANDIR_CONFIG from "../config/mandirConfig";
import { MaskedLine } from "./Reveal";
import Particles from "./Particles";
import { scrollToId } from "../lib/scroll";
import { useSettings } from "../lib/useSettings";

const Mandala = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow opacity-40" aria-hidden="true">
    {[190, 160, 120, 80].map((r, i) => (
      <circle
        key={r}
        cx="200"
        cy="200"
        r={r}
        fill="none"
        stroke="#d4af37"
        strokeWidth={i % 2 ? 0.7 : 0.4}
        strokeDasharray={i % 2 ? "3 9" : "1 5"}
      />
    ))}
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="200"
        y1="30"
        x2="200"
        y2="48"
        stroke="#d4af37"
        strokeWidth="0.6"
        transform={`rotate(${i * 15} 200 200)`}
      />
    ))}
  </svg>
);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const murtiY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const settings = useSettings();
  const isLive = settings.live?.isLive ?? MANDIR_CONFIG.liveDarshan.isLive;
  const mapsUrl = settings.links?.maps || MANDIR_CONFIG.googleMapsUrl;

  return (
    <section
      id="home"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden hero-vignette"
    >
      <Particles count={42} />
      <div className="absolute -top-40 -right-40 w-[560px] h-[560px] opacity-20 pointer-events-none">
        <Mandala />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-8 items-center w-full">
        {/* Left — kinetic text */}
        <div>
          <MaskedLine delay={0.15}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 px-4 py-1.5 text-[11px] font-display tracking-[0.35em] uppercase text-[#f3e5ab]/80">
              <span className="text-[#ff8c00]">॥</span> श्रीमद् धाम <span className="text-[#ff8c00]">॥</span>
            </span>
          </MaskedLine>

          <h1 className="mt-8 font-dev leading-[1.12]">
            <MaskedLine delay={0.35} className="text-5xl sm:text-6xl lg:text-7xl text-saffron-gradient">
              श्री संकट हरण
            </MaskedLine>
            <MaskedLine delay={0.5} className="text-5xl sm:text-6xl lg:text-7xl text-gold-gradient">
              बालाजी महाराज
            </MaskedLine>
          </h1>

          <MaskedLine delay={0.7}>
            <span className="mt-6 block font-display text-sm sm:text-base tracking-[0.28em] uppercase text-[#fdfbf7]/75">
              {MANDIR_CONFIG.templeNameEnglish}
            </span>
          </MaskedLine>
          <MaskedLine delay={0.82}>
            <span className="mt-2 block text-sm text-[#f3e5ab]/60 tracking-widest">
              Arnod · Pratapgarh · Rajasthan
            </span>
          </MaskedLine>

          <MaskedLine delay={0.95}>
            <span className="mt-8 block font-dev-body text-lg sm:text-xl text-[#f3e5ab]/85">
              {MANDIR_CONFIG.taglineHindi}
            </span>
          </MaskedLine>
          <MaskedLine delay={1.05}>
            <span className="mt-1 block font-display text-[11px] tracking-[0.3em] uppercase text-[#fdfbf7]/45">
              {MANDIR_CONFIG.taglineEnglish}
            </span>
          </MaskedLine>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              data-testid="hero-darshan-button"
              onClick={() => scrollToId("live-darshan")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-7 py-3.5 font-semibold text-[#1a0303] hover:shadow-[0_0_36px_rgba(255,107,0,0.5)] hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300"
            >
              <HandMetal size={17} />
              🙏 दर्शन करें
            </button>
            <button
              data-testid="hero-explore-button"
              onClick={() => scrollToId("explore")}
              className="flex items-center gap-2 rounded-full border border-[#d4af37]/50 px-7 py-3.5 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-[background-color,border-color] duration-300"
            >
              <Landmark size={17} />
              🛕 Explore Mandir
            </button>
            <a
              data-testid="hero-directions-button"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#ff6b00]/40 px-7 py-3.5 font-medium text-[#ffb877] hover:bg-[#ff6b00]/10 transition-colors duration-300"
            >
              <MapPin size={17} />
              📍 Get Directions
            </a>
          </motion.div>
        </div>

        {/* Right — murti with divine aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[380px]"
        >
          <motion.div style={{ opacity: glowOpacity }} className="absolute -inset-14 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.35),rgba(212,175,55,0.12)_45%,transparent_70%)] blur-2xl animate-aura" />
            <Mandala />
          </motion.div>

          <motion.figure
            style={{ y: murtiY }}
            className="relative rounded-t-[999px] rounded-b-3xl overflow-hidden gold-frame animate-float"
          >
            <img
              src={MANDIR_CONFIG.images.murti}
              alt="Shri Sankat Haran Balaji Maharaj Murti — Arnod Mandir"
              className="w-full h-[440px] sm:h-[520px] object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0303]/55 via-transparent to-transparent pointer-events-none" />
            <figcaption className="absolute bottom-4 inset-x-0 text-center font-dev text-[#f3e5ab] text-lg drop-shadow-lg">
              ॥ जय श्री बालाजी महाराज ॥
            </figcaption>
          </motion.figure>

          {isLive && (
            <button
              data-testid="hero-live-badge"
              onClick={() => scrollToId("live-darshan")}
              className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-[#1a0303]/90 border border-red-500/50 px-4 py-2 text-xs font-semibold text-red-300 backdrop-blur"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />
              LIVE · Aarti Darshan
            </button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#d4af37]/60 text-[10px] font-display tracking-[0.4em] uppercase"
      >
        Scroll · दर्शन हेतु नीचे
      </motion.div>
    </section>
  );
}
