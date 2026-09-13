// ============================================================
// श्री संकट हरण बालाजी महाराज मंदिर — CENTRAL CONFIGURATION
// Edit ONLY this file to update the whole website.
// ============================================================

const MANDIR_CONFIG = {
  // ---------- Names ----------
  templeNameHindi: "श्री संकट हरण बालाजी महाराज",
  templeNameEnglish: "Shri Sankat Haran Balaji Maharaj",
  templeSuffixHindi: "मंदिर, अरणोद",
  taglineHindi: "श्रद्धा • भक्ति • सेवा • आशीर्वाद",
  taglineEnglish: "Faith • Devotion • Service • Blessings",

  // ---------- Location ----------
  addressLine1: "Shri Sankat Haran Balaji Maharaj Mandir",
  addressLine2: "Arnod, Pratapgarh District, Rajasthan, India",
  // Replace with the official Google Maps share link when available:
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shri+Sankat+Haran+Balaji+Maharaj+Mandir+Arnod+Pratapgarh+Rajasthan",

  // ---------- Social / External Links (replace with real URLs) ----------
  instagramUrl: "https://www.instagram.com/srisankatharanbalajimaharaj",
  youtubeUrl: "https://www.youtube.com/@sankatharanbalaji",

  // ---------- Live Darshan ----------
  liveDarshan: {
    isLive: false, // set to true while Aarti is live on Instagram
    liveLabel: "Aarti Live",
    liveMessage: "Join us for Aarti Darshan on Instagram",
    offlineMessage:
      "Live Aarti Darshan Instagram पर प्रसारित होता है। Aarti के समय यहाँ से जुड़ें।",
  },

  // ---------- Photos (replace with new URLs anytime) ----------
  images: {
    murti:
      "https://customer-assets-wrfwihn1.emergentagent.net/job_bhakti-arnod/artifacts/dqwsck8o_IMG-20260904-WA0005.webp",
    sant1:
      "https://customer-assets-wrfwihn1.emergentagent.net/job_bhakti-arnod/artifacts/atsomq1g_%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80%20%E0%A4%9C%E0%A4%97%E0%A4%A8%E0%A5%8D%E0%A4%A8%E0%A4%BE%E0%A4%A5%20%E0%A4%9C%E0%A5%80%20%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%9C%20%28%E0%A4%B9%E0%A5%8B%E0%A4%B0%E0%A5%80%20%E0%A4%B9%E0%A4%A8%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%9C%E0%A5%80%20%E0%A4%B5%E0%A4%BE%E0%A4%B2%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%AC%E0%A4%9C%E0%A5%80%29.webp",
    sant2:
      "https://customer-assets-wrfwihn1.emergentagent.net/job_bhakti-arnod/artifacts/y8d24jsj_DyXRtLUE_400x400.jpg",
  },

  // ---------- Saints (edit name/title here) ----------
  sants: [
    {
      name: "श्री श्री १००८ श्री जगन्नाथ जी महाराज",
      title: "श्री होरी हनुमान जी वाले बाबाजी",
      imageKey: "sant1",
    },
    {
      name: "परम् पूज्य गुरुदेव स्वामी अवधेशानंद गिरि जी महाराज",
      title: "आचार्य महामंडलेश्वर",
      imageKey: "sant2",
    },
  ],

  // ---------- Contact / Mandir Seva Karmi ----------
  contacts: [
    { name: "Kush Soni", phone: "7023526965" },
    { name: "Rishabh Jain", phone: "9352772101" },
  ],

  // ---------- Mandir Schedule (edit times here) ----------
  schedule: [
    {
      icon: "sunrise",
      titleHi: "प्रातः दर्शन",
      titleEn: "Morning Darshan",
      time: "6:00 AM",
      desc: "मंदिर खुलने एवं प्रातः दर्शन",
    },
    {
      icon: "bell",
      titleHi: "प्रातः आरती",
      titleEn: "Morning Aarti",
      time: "7:00 AM",
      desc: "शृंगार एवं प्रातः आरती",
    },
    {
      icon: "temple",
      titleHi: "दर्शन समय",
      titleEn: "Mandir Darshan Hours",
      time: "सम्पूर्ण दिन खुला",
      desc: "मंदिर पूरे दिन दर्शन हेतु खुला रहता है",
    },
    {
      icon: "moon",
      titleHi: "शयन आरती",
      titleEn: "Shayan Aarti",
      time: "8:00 PM",
      desc: "शयन आरती एवं मंदिर समापन",
    },
  ],
  scheduleNotice:
    "Aarti एवं दर्शन का समय विशेष अवसरों पर परिवर्तित हो सकता है।",

  // ---------- Explore Mandir chapters (editable) ----------
  exploreIntro:
    "श्री संकट हरण बालाजी महाराज मंदिर, अरणोद (प्रतापगढ़, राजस्थान) भक्ति, श्रद्धा एवं सेवा का पावन केंद्र है। यहाँ बालाजी महाराज के दिव्य दर्शन, आरती एवं उत्सवों में भक्तगण सहृदय उपस्थित होते हैं।",
  exploreChapters: [
    {
      titleHi: "मंदिर दर्शन",
      titleEn: "Mandir Darshan",
      text: "गर्भगृह में विराजमान बालाजी महाराज के दिव्य दर्शन भक्तों के संकट हरने वाले माने जाते हैं। दर्शन एवं आरती का विवरण मंदिर समिति द्वारा जल्द साझा किया जाएगा।",
    },
    {
      titleHi: "बालाजी महाराज",
      titleEn: "Balaji Maharaj",
      text: "संकट हरण बालाजी महाराज — श्री हनुमान जी के भक्तों पर अपार कृपा। महाराज से जुड़ी विस्तृत जानकारी मंदिर समिति द्वारा उपलब्ध कराई जाएगी।",
    },
    {
      titleHi: "मंदिर का वातावरण",
      titleEn: "Mandir Atmosphere",
      text: "दीपों की रोशनी, घंटियों की ध्वनि एवं भजनों से सराबोर शांतिपूर्ण वातावरण भक्तों को आध्यात्मिक अनुभव प्रदान करता है।",
    },
    {
      titleHi: "भक्ति एवं सेवा",
      titleEn: "Bhakti & Seva",
      text: "मंदिर में सेवा के अवसर भक्तों के लिए सदैव खुले हैं। सेवा हेतु मंदिर सेवाकर्मियों से संपर्क करें।",
    },
    {
      titleHi: "उत्सव",
      titleEn: "Festivals",
      text: "हनुमान जयंती, राम नवमी एवं अन्य पावन पर्वों पर मंदिर में विशेष कार्यक्रम आयोजित होते हैं। कार्यक्रम विवरण यहीं साझा किया जाएगा।",
    },
    {
      titleHi: "आरती",
      titleEn: "Aarti",
      text: "प्रातः एवं संध्या आरती में भक्तगण सहभागी होकर महाराज का आशीर्वाद प्राप्त करते हैं। आरती का लाइव प्रसारण Instagram पर उपलब्ध रहता है।",
    },
    {
      titleHi: "आध्यात्मिक महत्व",
      titleEn: "Spiritual Significance",
      text: "बालाजी महाराज की उपासना से संकटों का नाश एवं मनोकामना पूर्ति की परंपरा है। मंदिर का विस्तृत इतिहास मंदिर समिति द्वारा साझा किया जाएगा।",
    },
  ],

  // ---------- Festivals (editable; dates approximate & configurable) ----------
  festivals: [
    {
      nameHi: "हनुमान जयंती",
      nameEn: "Hanuman Jayanti",
      hinduDate: "चैत्र पूर्णिमा",
      gregorian: "April 2026 (तिथि अनुसार)",
      deity: "श्री हनुमान जी",
      desc: "संकटमोचन श्री हनुमान जी के प्राकट्य दिवस का पावन पर्व।",
    },
    {
      nameHi: "राम नवमी",
      nameEn: "Ram Navami",
      hinduDate: "चैत्र शुक्ल नवमी",
      gregorian: "March 2026 (तिथि अनुसार)",
      deity: "श्री राम",
      desc: "मर्यादा पुरुषोत्तम भगवान श्री राम के जन्म का महापर्व।",
    },
    {
      nameHi: "गुरु पूर्णिमा",
      nameEn: "Guru Purnima",
      hinduDate: "आषाढ़ पूर्णिमा",
      gregorian: "July 2026 (तिथि अनुसार)",
      deity: "गुरु परंपरा",
      desc: "गुरु के प्रति श्रद्धा एवं कृतज्ञता का पावन दिन।",
    },
    {
      nameHi: "श्रीकृष्ण जन्माष्टमी",
      nameEn: "Janmashtami",
      hinduDate: "भाद्रपद कृष्ण अष्टमी",
      gregorian: "September 2026 (तिथि अनुसार)",
      deity: "श्री कृष्ण",
      desc: "भगवान श्री कृष्ण के प्राकट्य का आनंदमयी उत्सव।",
    },
    {
      nameHi: "शारदीय नवरात्रि",
      nameEn: "Sharad Navratri",
      hinduDate: "आश्विन शुक्ल प्रतिपदा – नवमी",
      gregorian: "October 2026 (तिथि अनुसार)",
      deity: "माँ दुर्गा",
      desc: "नौ दिवसीय शक्ति उपासना का पावन पर्व।",
    },
    {
      nameHi: "विजयादशमी (दशहरा)",
      nameEn: "Dussehra",
      hinduDate: "आश्विन शुक्ल दशमी",
      gregorian: "October 2026 (तिथि अनुसार)",
      deity: "श्री राम",
      desc: "अधर्म पर धर्म की विजय का प्रतीक महापर्व।",
    },
    {
      nameHi: "दीपावली",
      nameEn: "Diwali",
      hinduDate: "कार्तिक अमावस्या",
      gregorian: "November 2026 (तिथि अनुसार)",
      deity: "माँ लक्ष्मी",
      desc: "दीपों एवं आलोक का महापर्व — अंधकार पर प्रकाश की विजय।",
    },
    {
      nameHi: "महाशिवरात्रि",
      nameEn: "Mahashivratri",
      hinduDate: "फाल्गुन कृष्ण चतुर्दशी",
      gregorian: "February 2027 (तिथि अनुसार)",
      deity: "भगवान शिव",
      desc: "भगवान शिव की आराधना की महापुण्य रात्रि।",
    },
  ],

  // ---------- Seva / Donation (DO NOT fill until official details provided) ----------
  seva: {
    headingHi: "मंदिर सेवा एवं सहयोग",
    quoteHi: "मंदिर सेवा में आपका सहयोग श्रद्धा और भक्ति का माध्यम है।",
    qrImage: null, // e.g. "/images/upi-qr.png" — add when official QR is available
    bank: {
      accountName: "", // fill only with official temple details
      bankName: "",
      accountNumber: "",
      ifsc: "",
      upiId: "",
    },
    securityNote:
      "कृपया केवल मंदिर द्वारा उपलब्ध कराए गए आधिकारिक भुगतान विवरण का ही उपयोग करें।",
  },

  // ---------- Music / Streaming platforms ----------
  musicLinks: [
    { label: "WhatsApp Channel", sub: "मंदिर अपडेट सीधे WhatsApp पर", brand: "whatsapp", url: "https://whatsapp.com/channel/0029VbBLPeZEgGfDMHT1Ev09" },
    { label: "Arnod Balaji (Songs)", sub: "भजन एवं भक्ति गीत चैनल", brand: "youtube", url: "https://www.youtube.com/@arnodbalaji" },
    { label: "YouTube Music", sub: "भजन सुनें YouTube Music पर", brand: "youtubemusic", url: "https://music.youtube.com/channel/UCQCYNHOtnk1NZbS4OUob0fA" },
    { label: "Spotify", sub: "Mandir Songs on Spotify", brand: "spotify", url: "https://open.spotify.com/artist/5Tu1ttfY400yt7jDdM9FmS" },
    { label: "Apple Music", sub: "Mandir Songs on Apple Music", brand: "applemusic", url: "https://music.apple.com/us/artist/sri-sankatharan-balaji-maharaj-mandir-songs/1808988321" },
    { label: "Amazon Music", sub: "Mandir Songs on Amazon Music", brand: "amazonmusic", url: "https://music.amazon.in/artists/B0F5BDWNH8/sri-sankatharan-balaji-maharaj-mandir-songs" },
    { label: "Qobuz", sub: "Mandir Songs on Qobuz", brand: "qobuz", url: "https://qobuz.com/us-en/label/sri-sankatharan-balaji-maharaj-mandir-songs/download-streaming-albums/8094228" },
    { label: "JioSaavn", sub: "Mandir Songs on JioSaavn", brand: "jiosaavn", url: "https://www.jiosaavn.com/artist/sri-sankatharan-balaji-maharaj-mandir-songs/Tm6H0vxApXQ_" },
  ],

  // ---------- Instagram Reels (paste reel links here, e.g. "https://www.instagram.com/reel/ABC123/") ----------
  instagramReels: [],

  // ---------- Panchang location (for calculations only) ----------
  panchang: { latitude: 24.13, longitude: 74.82 },
};

export default MANDIR_CONFIG;
