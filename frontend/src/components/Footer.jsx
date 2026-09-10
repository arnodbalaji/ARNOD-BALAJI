import { Instagram, Youtube, MapPin } from "lucide-react";
import MANDIR_CONFIG from "../config/mandirConfig";
import { scrollToId } from "../lib/scroll";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "explore", label: "Explore Mandir" },
  { id: "schedule", label: "Schedule" },
  { id: "panchang", label: "Panchang" },
  { id: "festivals", label: "Festivals" },
  { id: "live-darshan", label: "Live Darshan" },
  { id: "seva", label: "Seva" },
  { id: "contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative bg-[#1a0303] border-t border-[#d4af37]/15 px-5 sm:px-8 pt-16 pb-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <p className="font-dev text-2xl text-gold-gradient leading-snug">
            {MANDIR_CONFIG.templeNameHindi}
          </p>
          <p className="mt-2 text-sm text-[#fdfbf7]/55">{MANDIR_CONFIG.addressLine2}</p>
          <a
            data-testid="footer-directions-link"
            href={MANDIR_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#ffb877] hover:text-[#ff8c00] transition-colors"
          >
            <MapPin size={15} />
            📍 Get Directions
          </a>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.35em] uppercase text-[#d4af37]/80 mb-5">
            Quick Links
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`footer-link-${l.id}`}
                onClick={() => scrollToId(l.id)}
                className="text-left text-sm text-[#fdfbf7]/60 hover:text-[#f3e5ab] transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.35em] uppercase text-[#d4af37]/80 mb-5">
            Follow
          </p>
          <div className="flex gap-4">
            <a
              data-testid="footer-instagram-link"
              href={MANDIR_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              data-testid="footer-youtube-link"
              href={MANDIR_CONFIG.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-11 h-11 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-14 pt-8 border-t border-[#d4af37]/10 text-center">
        <p className="font-dev text-xl text-saffron-gradient">🙏 जय श्री बालाजी महाराज 🙏</p>
        <p className="mt-4 text-xs text-[#fdfbf7]/35 tracking-wide">
          © {new Date().getFullYear()} Shri Sankat Haran Balaji Maharaj Mandir, Arnod · Pratapgarh, Rajasthan
        </p>
      </div>
    </footer>
  );
}
