import { useEffect, useState } from "react";
import { QrCode, ShieldCheck, Landmark } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Seva() {
  const { seva } = MANDIR_CONFIG;
  const [live, setLive] = useState(null);

  useEffect(() => {
    fetch(`${API}/seva`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setLive(d))
      .catch(() => setLive(null));
  }, []);

  const qrImage = live?.qrImage || seva.qrImage;
  const bankFields = [
    { label: "Account Name", value: live?.accountName ?? seva.bank.accountName },
    { label: "Bank Name", value: live?.bankName ?? seva.bank.bankName },
    { label: "Account Number", value: live?.accountNumber ?? seva.bank.accountNumber },
    { label: "IFSC", value: live?.ifsc ?? seva.bank.ifsc },
    { label: "UPI ID", value: live?.upiId ?? seva.bank.upiId },
  ];
  const hasBank = bankFields.some((f) => f.value);

  return (
    <section id="seva" data-testid="seva-section" className="relative py-28 px-5 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,rgba(212,175,55,0.07),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <SectionHeading eyebrow="Seva & Donation" titleHi={`🙏 ${seva.headingHi}`} titleEn="" />

        <Reveal className="text-center mb-12">
          <p className="font-dev-body text-lg text-[#f3e5ab]/85">“{seva.quoteHi}”</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          <Reveal>
            <div
              data-testid="seva-qr-card"
              className="glass-gold rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center"
            >
              {qrImage ? (
                <img
                  src={qrImage.startsWith("/api") ? `${process.env.REACT_APP_BACKEND_URL}${qrImage}` : qrImage}
                  alt="Mandir UPI QR Code"
                  className="w-56 h-56 rounded-2xl border border-[#d4af37]/40 object-contain bg-white p-2"
                />
              ) : (
                <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-[#d4af37]/40 flex flex-col items-center justify-center gap-3 text-[#d4af37]/70">
                  <QrCode size={44} strokeWidth={1.2} />
                  <span className="font-display text-xs tracking-[0.25em] uppercase">
                    QR Code Coming Soon
                  </span>
                </div>
              )}
              <p className="mt-6 text-sm text-[#fdfbf7]/55">
                आधिकारिक UPI QR कोड मंदिर समिति द्वारा शीघ्र उपलब्ध कराया जाएगा।
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              data-testid="seva-bank-card"
              className="glass-gold rounded-3xl p-8 h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <Landmark size={17} />
                </span>
                <h3 className="font-dev text-xl text-[#f3e5ab]">बैंक / UPI विवरण</h3>
              </div>
              {hasBank ? (
                <dl className="space-y-4">
                  {bankFields.map(
                    (f) =>
                      f.value && (
                        <div key={f.label} className="flex justify-between gap-4 border-b border-[#d4af37]/10 pb-3">
                          <dt className="text-xs uppercase tracking-widest text-[#fdfbf7]/45">{f.label}</dt>
                          <dd className="text-sm font-medium text-[#f3e5ab] text-right">{f.value}</dd>
                        </div>
                      )
                  )}
                </dl>
              ) : (
                <p className="text-sm leading-relaxed text-[#fdfbf7]/55">
                  मंदिर का आधिकारिक बैंक एवं UPI विवरण अभी उपलब्ध नहीं है। मंदिर समिति द्वारा
                  विवरण साझा किए जाने पर यहाँ प्रकाशित किया जाएगा।
                </p>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div
            data-testid="seva-security-note"
            className="flex items-start sm:items-center gap-3 rounded-2xl border border-[#ff6b00]/30 bg-[#ff6b00]/[0.06] px-6 py-4"
          >
            <ShieldCheck size={20} className="text-[#ff8c00] shrink-0" />
            <p className="font-dev-body text-sm sm:text-base text-[#ffb877]">{seva.securityNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
