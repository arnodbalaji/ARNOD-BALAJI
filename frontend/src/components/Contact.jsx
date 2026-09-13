import { Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";
import { useSettings } from "../lib/useSettings";

export default function Contact() {
  const settings = useSettings();
  const mapsUrl = settings.links?.maps || MANDIR_CONFIG.googleMapsUrl;
  return (
    <section id="contact" data-testid="contact-section" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Contact" titleHi="📞 मंदिर सेवाकर्मी" titleEn="Mandir Seva Karmi" />

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {MANDIR_CONFIG.contacts.map((c, i) => (
            <Reveal key={c.phone} delay={0.08 * i}>
              <div
                data-testid={`contact-card-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="glass-gold rounded-3xl p-8 text-center hover:border-[#d4af37]/50 transition-colors duration-500"
              >
                <span className="mx-auto w-14 h-14 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                  <Phone size={22} />
                </span>
                <h3 className="mt-5 font-semibold text-xl text-[#f3e5ab]">{c.name}</h3>
                <p className="mt-1 text-[#fdfbf7]/60 tracking-wider">{c.phone}</p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    data-testid={`call-${c.name.toLowerCase().replace(/\s+/g, "-")}-button`}
                    href={`tel:+91${c.phone}`}
                    className="rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-6 py-3 font-semibold text-[#1a0303] hover:shadow-[0_0_24px_rgba(255,107,0,0.4)] transition-shadow duration-300"
                  >
                    Call Now
                  </a>
                  <a
                    data-testid={`whatsapp-${c.name.toLowerCase().replace(/\s+/g, "-")}-button`}
                    href={`https://wa.me/91${c.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#25D366]/40 px-6 py-3 font-medium text-[#7ee2a8] hover:bg-[#25D366]/10 transition-colors duration-300"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div
            data-testid="directions-card"
            className="glass-gold rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left"
          >
            <span className="w-16 h-16 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00] shrink-0">
              <MapPin size={28} />
            </span>
            <div className="flex-1">
              <h3 className="font-dev text-2xl text-[#f3e5ab]">📍 {MANDIR_CONFIG.addressLine1}</h3>
              <p className="mt-1 text-[#fdfbf7]/60">{MANDIR_CONFIG.addressLine2}</p>
            </div>
            <a
              data-testid="open-google-maps-button"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-7 py-3.5 font-semibold text-[#1a0303] hover:shadow-[0_0_28px_rgba(255,107,0,0.45)] hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300 shrink-0"
            >
              Open in Google Maps
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
