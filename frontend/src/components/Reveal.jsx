import { motion } from "framer-motion";

export const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
    <motion.span
      className={`block ${className}`}
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Reveal = ({ children, delay = 0, className = "", y = 36 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ eyebrow, titleHi, titleEn, align = "center" }) => (
  <Reveal className={`mb-14 ${align === "center" ? "text-center" : "text-left"}`}>
    <p className="font-display text-[11px] tracking-[0.45em] uppercase text-[#d4af37]/80 mb-4">
      {eyebrow}
    </p>
    <h2 className="font-dev text-4xl sm:text-5xl text-gold-gradient leading-snug">{titleHi}</h2>
    {titleEn && (
      <p className="font-display text-sm sm:text-base tracking-[0.25em] uppercase text-[#fdfbf7]/60 mt-3">
        {titleEn}
      </p>
    )}
    <div
      className={`mt-6 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
    >
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/70" />
      <span className="text-[#ff8c00] text-sm">ॐ</span>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/70" />
    </div>
  </Reveal>
);
