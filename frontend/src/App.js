import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Explore from "./components/Explore";
import History from "./components/History";
import Schedule from "./components/Schedule";
import Panchang from "./components/Panchang";
import Festivals from "./components/Festivals";
import LiveDarshan from "./components/LiveDarshan";
import { YouTubeSection, InstagramSection } from "./components/Social";
import MusicSection from "./components/Music";
import Seva from "./components/Seva";
import Saints from "./components/Saints";
import SantGallery from "./components/SantGallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SanatanChat from "./components/SanatanChat";
import SoundToggle from "./components/SoundToggle";
import Admin from "./components/Admin";
import ShlokaOfDay from "./components/ShlokaOfDay";
import CustomSections from "./components/CustomSections";
import FestivalBanner from "./components/FestivalBanner";
import { setLenis } from "./lib/scroll";
import { armGreeting } from "./lib/greeting";

function App() {
  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    if (isAdmin) return;
    armGreeting();
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="bg-[#0b0e14] text-[#fdfbf7] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FestivalBanner />
        <ShlokaOfDay />
        <Saints />
        <Explore />
        <History />
        <Schedule />
        <Panchang />
        <SantGallery />
        <Festivals />
        <LiveDarshan />
        <YouTubeSection />
        <MusicSection />
        <InstagramSection />
        <Seva />
        <CustomSections />
        <Contact />
      </main>
      <Footer />
      <SanatanChat />
      <SoundToggle />
      <Toaster position="bottom-center" theme="dark" />
    </div>
  );
}

export default App;
