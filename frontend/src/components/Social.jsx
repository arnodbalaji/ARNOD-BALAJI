import { useEffect, useState } from "react";
import { Youtube, Instagram, Play, ArrowUpRight, X, Radio } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import MANDIR_CONFIG from "../config/mandirConfig";
import { useSettings } from "../lib/useSettings";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const extractVideoId = (s) => {
  const m = String(s).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  if (m) return m[1];
  const bare = String(s).trim();
  return /^[\w-]{11}$/.test(bare) ? bare : null;
};

const isShort = (v) => /#?shorts/i.test(v.title || "");

export function YouTubeSection() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(null);
  const settings = useSettings();
  const pinnedIds = (settings.pinnedVideos || []).map(extractVideoId).filter(Boolean);
  const pinned = pinnedIds.map((id) => ({
    id,
    title: "📌 Pinned Bhajan",
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${id}`,
    pinned: true,
  }));

  useEffect(() => {
    fetch(`${API}/media/youtube`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const channels = data?.channels || [];
  const current = channels[active];
  const playlist = [
    ...pinned,
    ...(current?.videos || []).filter((v) => !pinnedIds.includes(v.id)),
  ];

  return (
    <section id="youtube" data-testid="youtube-section" className="relative py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Bhakti Videos" titleHi="🙏 Bhakti & Aarti on YouTube" titleEn="Both Mandir Channels" />

        {/* Channel selector cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {(channels.length ? channels : [
            { name: "Shri Sankat Haran Balaji Maharaj", subscribe: MANDIR_CONFIG.youtubeUrl, liveUrl: `${MANDIR_CONFIG.youtubeUrl}/live`, videos: [] },
            { name: "Arnod Balaji (Songs)", subscribe: "https://www.youtube.com/@arnodbalaji", liveUrl: "https://www.youtube.com/@arnodbalaji/live", videos: [] },
          ]).map((ch, i) => (
            <Reveal key={ch.name} delay={0.08 * i}>
              <div
                data-testid={`youtube-channel-${i + 1}`}
                className={`glass-gold rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-[border-color,box-shadow] duration-300 ${
                  active === i ? "border-[#ff6b00]/60 shadow-[0_0_28px_rgba(255,107,0,0.15)]" : "hover:border-[#d4af37]/50"
                }`}
                onClick={() => setActive(i)}
              >
                <span className="w-14 h-14 rounded-2xl bg-red-600/15 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                  <Youtube size={26} />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#f3e5ab] truncate">{ch.name}</h3>
                  <p className="text-xs text-[#fdfbf7]/50 mt-0.5">Aarti · Bhajan · Events</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    data-testid={`youtube-subscribe-${i + 1}`}
                    href={ch.subscribe}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors text-center"
                  >
                    Subscribe
                  </a>
                  <a
                    data-testid={`youtube-live-${i + 1}`}
                    href={ch.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Radio size={12} /> Live
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Videos playlist grid */}
        {playlist.length > 0 ? (
          <div data-testid="youtube-playlist" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {playlist.map((v) => (
              <button
                key={v.id}
                data-testid={`youtube-video-${v.id}`}
                onClick={() => setPlaying(v.id)}
                className="group relative rounded-2xl overflow-hidden border border-[#d4af37]/25 hover:border-[#ff8c00]/60 transition-colors duration-300 text-left"
              >
                <img src={v.thumb} alt={v.title} loading="lazy" className={`w-full ${isShort(v) ? "aspect-[9/16]" : "aspect-video"} object-cover group-hover:scale-105 transition-transform duration-500`} />
                <span className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={18} className="text-white ml-0.5" />
                  </span>
                </span>
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-xs text-[#fdfbf7]/90 leading-snug line-clamp-2">
                  {v.title}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Reveal className="text-center">
            <p className="text-sm text-[#fdfbf7]/50">
              नवीनतम वीडियो YouTube चैनल पर देखें —
              <a href={MANDIR_CONFIG.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[#ffb877] hover:text-[#ff8c00] ml-1 underline underline-offset-4">
                चैनल खोलें
              </a>
            </p>
          </Reveal>
        )}

        {/* Inline player modal */}
        {playing && (
          <div
            data-testid="youtube-player-modal"
            className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
                <iframe
                  src={`https://www.youtube.com/embed/${playing}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="Bhakti video"
                />
              </div>
              <button
                data-testid="youtube-player-close"
                onClick={() => setPlaying(null)}
                className="mt-4 mx-auto flex items-center gap-2 rounded-full border border-[#d4af37]/50 px-6 py-2.5 text-sm text-[#f3e5ab] hover:bg-[#d4af37]/10 transition-colors"
              >
                <X size={15} /> बंद करें
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const reelId = (url) => {
  const m = url.match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/);
  return m ? m[1] : null;
};

export function InstagramSection() {
  const settings = useSettings();
  const items = [
    { title: "Live Darshan", desc: "आरती के लाइव प्रसारण की सूचना" },
    { title: "Aarti Updates", desc: "दैनिक आरती एवं दर्शन अपडेट" },
    { title: "Festival Updates", desc: "पर्वों एवं विशेष कार्यक्रमों की जानकारी" },
    { title: "Temple Announcements", desc: "मंदिर की आधिकारिक घोषणाएँ" },
  ];
  const reelSource = settings.instagramReels?.length ? settings.instagramReels : MANDIR_CONFIG.instagramReels;
  const reels = (reelSource || [])
    .map((url) => ({ url, id: reelId(url) }))
    .filter((r) => r.id);

  return (
    <section id="instagram" data-testid="instagram-section" className="relative py-24 px-5 sm:px-8 bg-[#0d0710]/60">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Social" titleHi="📿 Connect With Us" titleEn="Instagram" />
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={0.05 * i}>
              <div className="glass-gold rounded-2xl p-6 flex items-center gap-4 hover:border-[#ff8c00]/40 transition-colors duration-500">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b00]/25 to-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#ffb877]">
                  <Instagram size={19} />
                </span>
                <div>
                  <h4 className="font-semibold text-[#f3e5ab]">{it.title}</h4>
                  <p className="text-sm text-[#fdfbf7]/55">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Reels / Shorts */}
        <Reveal className="mt-14">
          <h3 className="font-dev text-2xl text-gold-gradient text-center mb-8">📿 Reels & Shorts</h3>
        </Reveal>
        {reels.length > 0 ? (
          <div data-testid="instagram-reels" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((r) => (
              <div key={r.id} className="rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-black/40">
                <iframe
                  src={`https://www.instagram.com/reel/${r.id}/embed`}
                  className="w-full h-[480px]"
                  frameBorder="0"
                  scrolling="no"
                  title={`Instagram reel ${r.id}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <Reveal>
            <a
              data-testid="instagram-reels-cta"
              href={MANDIR_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass-gold rounded-3xl p-10 text-center hover:border-[#ff8c00]/50 transition-colors duration-500"
            >
              <span className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b00]/25 to-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#ffb877] group-hover:scale-105 transition-transform">
                <Instagram size={24} />
              </span>
              <p className="mt-4 font-dev text-xl text-[#f3e5ab]">नवीनतम Reels & Shorts</p>
              <p className="mt-2 text-sm text-[#fdfbf7]/55">
                आरती, दर्शन एवं उत्सवों की reels हमारे Instagram पर देखें
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#ffb877] group-hover:text-[#ff8c00] transition-colors">
                Instagram पर देखें <ArrowUpRight size={15} />
              </span>
            </a>
          </Reveal>
        )}

        <Reveal className="mt-10 text-center">
          <a
            data-testid="instagram-profile-button"
            href={MANDIR_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] px-8 py-3.5 font-semibold text-[#1a0303] hover:shadow-[0_0_32px_rgba(255,107,0,0.45)] transition-shadow duration-300"
          >
            Follow on Instagram
            <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
