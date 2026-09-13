import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function InstallApp({ className = "" }) {
  const [deferred, setDeferred] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      toast.success("🙏 App install हो रहा है");
    } else {
      toast.info("Browser menu (⋮) → 'Add to Home Screen' / 'Install app' चुनें", { duration: 5000 });
    }
  };

  return (
    <button
      data-testid="app-install-button"
      onClick={install}
      className={`inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 px-5 py-2.5 text-xs font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-colors ${className}`}
    >
      <Download size={14} />
      📱 App Download करें
    </button>
  );
}
