import { Music } from "lucide-react";
import {
  siWhatsapp,
  siYoutube,
  siYoutubemusic,
  siSpotify,
  siApplemusic,
  siJio,
  siInstagram,
} from "simple-icons";

const BRANDS = {
  whatsapp: siWhatsapp,
  youtube: siYoutube,
  youtubemusic: siYoutubemusic,
  spotify: siSpotify,
  applemusic: siApplemusic,
  jiosaavn: siJio,
  instagram: siInstagram,
};

export default function BrandIcon({ brand, size = 20, className = "", colored = true }) {
  const icon = BRANDS[brand];
  if (!icon) {
    return <Music size={size} className={`text-[#ff8c00] ${className}`} />;
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={icon.title}
      className={className}
      fill={colored ? `#${icon.hex}` : "currentColor"}
    >
      <path d={icon.path} />
    </svg>
  );
}
