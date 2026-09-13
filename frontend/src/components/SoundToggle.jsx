import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [muted, setMuted] = useState(() => localStorage.getItem("sound_muted") === "1");

  const toggle = () => {
    const next = !muted;
    localStorage.setItem("sound_muted", next ? "1" : "0");
    setMuted(next);
  };

  return (
    <button
      data-testid="sound-toggle-button"
      onClick={toggle}
      aria-label={muted ? "ध्वनि चालू करें" : "ध्वनि बंद करें"}
      title={muted ? "ध्वनि चालू करें" : "ध्वनि बंद करें"}
      className="fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full glass-gold flex items-center justify-center text-[#f3e5ab] hover:border-[#ff8c00]/60 transition-colors"
    >
      {muted ? <VolumeX size={18} className="text-[#fdfbf7]/50" /> : <Volume2 size={18} />}
    </button>
  );
}
