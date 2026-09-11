import { Reveal, SectionHeading } from "./Reveal";
import { Flame, Footprints, Sparkles, Landmark } from "lucide-react";

const CHAPTERS = [
  {
    icon: Flame,
    title: "स्वयंभू बालाजी महाराज",
    text: "मंदिर में विराजमान श्री बालाजी महाराज की प्रतिमा को भक्तगण स्वयंभू मानते हैं। श्रद्धालुओं की आस्था है कि यह प्रतिमा किसी मनुष्य द्वारा स्थापित नहीं की गई, बल्कि स्वयं प्रकट हुई है। इसी कारण यहाँ के बालाजी महाराज को जागृत एवं चमत्कारी स्वरूप के रूप में पूजा जाता है। दूर-दूर से श्रद्धालु अपनी श्रद्धा और विश्वास के साथ यहाँ दर्शन करने आते हैं तथा अपनी मनोकामनाएँ बालाजी महाराज के चरणों में रखते हैं।",
  },
  {
    icon: Footprints,
    title: "संत श्री जगन्नाथ होरी बालाजी वाले का आगमन",
    text: "मंदिर से जुड़ी एक विशेष धार्मिक मान्यता के अनुसार, एक बार संत श्री जगन्नाथ होरी बालाजी वाले यहाँ पधारे थे। उन्होंने मंदिर में कुछ समय विश्राम किया और बालाजी महाराज के दर्शन किए। संत श्री जगन्नाथ जी ने भी यहाँ विराजमान श्री हनुमानजी के स्वरूप को स्वयं जागृत बालाजी महाराज के रूप में जाना और इसकी दिव्यता को अनुभव किया। उनके आगमन को मंदिर की आध्यात्मिक परंपरा में एक महत्वपूर्ण प्रसंग के रूप में याद किया जाता है।",
  },
  {
    icon: Sparkles,
    title: "चमत्कारों की आस्था",
    text: "श्री संकट हरण बालाजी महाराज के प्रति भक्तों की गहरी आस्था के पीछे यहाँ से जुड़ी अनेक चमत्कारिक घटनाओं और भक्तों के अनुभवों की मान्यता भी है। भक्तों का विश्वास है कि जो व्यक्ति सच्ची श्रद्धा, विश्वास और निष्कपट भाव से बालाजी महाराज के दरबार में आता है, बालाजी महाराज उसके संकट हरते हैं और उसकी मनोकामना पूर्ण करने की कृपा करते हैं। इसी आस्था के कारण भक्त उन्हें प्रेम और श्रद्धा से \u201Cसंकट हरण बालाजी महाराज\u201D कहकर पुकारते हैं।",
  },
  {
    icon: Landmark,
    title: "आस्था का पवित्र धाम",
    text: "पीढ़ी-दर-पीढ़ी चली आ रही श्रद्धा और विश्वास ने इस मंदिर को भक्तों के लिए विशेष धार्मिक महत्व प्रदान किया है। यहाँ आने वाला प्रत्येक श्रद्धालु बालाजी महाराज के चरणों में अपनी प्रार्थना अर्पित करता है और जीवन के कष्टों से मुक्ति तथा सुख-शांति की कामना करता है। श्री संकट हरण बालाजी महाराज का दरबार आज भी भक्तों के लिए आस्था, विश्वास और भक्ति का पवित्र केंद्र है।",
  },
];

export default function History() {
  return (
    <section
      id="history"
      data-testid="history-section"
      className="relative py-28 px-5 sm:px-8 overflow-hidden bg-gradient-to-b from-[#1a0303]/70 via-[#0b0e14] to-[#0b0e14]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_0%,rgba(255,107,0,0.1),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <SectionHeading eyebrow="Sacred Heritage" titleHi="🚩 मंदिर का इतिहास" titleEn="The Story of the Mandir" />

        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-dev-body text-base sm:text-lg leading-relaxed text-[#fdfbf7]/75">
            राजस्थान के पावन अंचल में स्थित श्री संकट हरण बालाजी महाराज का यह प्राचीन मंदिर श्रद्धा,
            आस्था और भक्ति का एक महत्वपूर्ण केंद्र माना जाता है। स्थानीय मान्यता के अनुसार यह मंदिर
            अंग्रेजों के शासनकाल से भी पहले का प्राचीन मंदिर है और यहाँ विराजमान श्री हनुमानजी की
            प्रतिमा स्वयंभू एवं जागृत स्वरूप मानी जाती है।
          </p>
        </Reveal>

        <div className="space-y-6">
          {CHAPTERS.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <Reveal key={ch.title} delay={0.06 * i}>
                <article
                  data-testid={`history-chapter-${i + 1}`}
                  className="glass-gold rounded-3xl p-7 sm:p-9 flex flex-col sm:flex-row gap-6 hover:border-[#ff8c00]/40 transition-colors duration-500"
                >
                  <div className="flex sm:flex-col items-center gap-3 shrink-0">
                    <span className="w-12 h-12 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff8c00]">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-sm text-[#d4af37]/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-dev text-2xl text-gold-gradient">{ch.title}</h3>
                    <p className="mt-3 font-dev-body text-sm sm:text-base leading-relaxed text-[#fdfbf7]/65">
                      {ch.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center space-y-2">
          <p className="font-dev text-xl text-saffron-gradient">🚩 जय श्री राम</p>
          <p className="font-dev text-xl text-saffron-gradient">🚩 जय बजरंगबली</p>
          <p className="font-dev text-2xl text-gold-gradient">🚩 श्री संकट हरण बालाजी महाराज की जय 🚩</p>
        </Reveal>
      </div>
    </section>
  );
}
