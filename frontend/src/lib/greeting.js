export function armGreeting() {
  const today = new Date().toDateString();
  if (localStorage.getItem("greeting_played") === today) return;

  const play = async () => {
    window.removeEventListener("pointerdown", play);
    window.removeEventListener("scroll", play);
    if (localStorage.getItem("sound_muted") === "1") return;
    localStorage.setItem("greeting_played", today);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/audio/greeting`);
      if (!res.ok) return;
      const buf = await res.arrayBuffer();
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const audio = await ctx.decodeAudioData(buf);

      const src = ctx.createBufferSource();
      src.buffer = audio;

      const master = ctx.createGain();
      master.gain.value = 0.9;

      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.32;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.3;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;

      src.connect(master);
      src.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);
      master.connect(ctx.destination);

      const end = ctx.currentTime + audio.duration;
      master.gain.setValueAtTime(0.9, end);
      master.gain.exponentialRampToValueAtTime(0.0001, end + 2.4);

      src.start();
      setTimeout(() => ctx.close(), (audio.duration + 3.5) * 1000);
    } catch {}
  };

  window.addEventListener("pointerdown", play);
  window.addEventListener("scroll", play, { passive: true });
}
