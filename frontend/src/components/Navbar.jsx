import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Flame } from "lucide-react";
import MANDIR_CONFIG from "../config/mandirConfig";
import { scrollToId } from "../lib/scroll";
import InstallApp from "./InstallApp";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "saints", label: "Sant Darshan" },
  { id: "explore", label: "Explore Mandir" },
  { id: "schedule", label: "Schedule" },
  { id: "panchang", label: "Panchang & Calendar" },
  { id: "festivals", label: "Festivals" },
  { id: "live-darshan", label: "Live Darshan" },
  { id: "seva", label: "Seva" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-[#0b0e14]/85 backdrop-blur-xl border-b border-[#d4af37]/15"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => (window.location.href = "/admin")}
          className="flex items-center gap-3 text-left"
          title="Owner Login"
        >
          <span className="w-10 h-10 rounded-full gold-frame flex items-center justify-center text-[#ff8c00] font-dev text-lg leading-none">
            ॐ
          </span>
          <span className="leading-tight">
            <span className="block font-dev text-base sm:text-lg text-gold-gradient">
              {MANDIR_CONFIG.templeNameHindi}
            </span>
            <span className="block font-display text-[9px] tracking-[0.3em] uppercase text-[#fdfbf7]/50">
              Arnod · Pratapgarh
            </span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-4 xl:gap-5">
          {LINKS.slice(1).map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="text-xs font-medium text-[#fdfbf7]/70 hover:text-[#f3e5ab] transition-colors duration-300 tracking-wide"
            >
              {l.label}
            </button>
          ))}
          <InstallApp className="ml-2 hidden xl:inline-flex !px-4 !py-2" />
          <button
            data-testid="nav-live-darshan-button"
            onClick={() => go("live-darshan")}
            className="ml-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-4 py-2 text-[13px] font-semibold text-[#1a0303] hover:shadow-[0_0_24px_rgba(255,107,0,0.45)] transition-shadow duration-300"
          >
            <Flame size={14} />
            Live Darshan
          </button>
        </div>

        <button
          data-testid="nav-hamburger"
          className="lg:hidden text-[#f3e5ab] p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#0b0e14]/95 backdrop-blur-xl border-b border-[#d4af37]/15"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`nav-mobile-link-${l.id}`}
                  onClick={() => go(l.id)}
                  className="text-left py-3 border-b border-[#d4af37]/10 text-[#fdfbf7]/80 hover:text-[#f3e5ab] font-medium tracking-wide"
                >
                  {l.label}
                </button>
              ))}
              <button
                data-testid="nav-mobile-live-darshan-button"
                onClick={() => go("live-darshan")}
                className="mt-4 mb-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-4 py-3 text-sm font-semibold text-[#1a0303]"
              >
                <Flame size={15} />
                🙏 Live Darshan
              </button>
              <InstallApp className="mb-3 w-full justify-center !py-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
