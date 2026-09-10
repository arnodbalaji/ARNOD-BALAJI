const PHRASES = [
  "॥ श्री संकट हरण बालाजी महाराज ॥",
  "जय श्री राम",
  "श्रद्धा • भक्ति • सेवा • आशीर्वाद",
  "संकट कटै मिटै सब पीरा",
  "ॐ हं हनुमते नमः",
  "जय श्री बालाजी महाराज",
];

export default function Marquee() {
  const row = [...PHRASES, ...PHRASES];
  return (
    <div className="relative border-y border-[#d4af37]/15 bg-[#1a0303]/60 overflow-hidden py-5">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((p, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-dev text-lg sm:text-xl text-[#f3e5ab]/75 px-8">{p}</span>
                <span className="text-[#ff8c00]/70">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
