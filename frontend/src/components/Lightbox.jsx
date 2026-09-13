import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Lightbox({ src, alt, onClose }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          data-testid="photo-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.figure
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-3xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl gold-frame object-contain bg-[#0b0e14]"
            />
            {alt && (
              <figcaption className="mt-4 font-dev-body text-base sm:text-lg text-[#f3e5ab] text-center px-4">
                {alt}
              </figcaption>
            )}
            <button
              data-testid="lightbox-close"
              onClick={onClose}
              className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-10 h-10 rounded-full bg-[#1a0303] border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center hover:bg-[#d4af37]/15 transition-colors"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
