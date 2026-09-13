export function playBellOnce() {
  if (localStorage.getItem("bell_played") || localStorage.getItem("sound_muted") === "1") return;
  localStorage.setItem("bell_played", "1");
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3200;
    master.connect(filter);
    filter.connect(ctx.destination);
    const base = 523.25;
    const partials = [
      [1, 1],
      [2.01, 0.55],
      [2.74, 0.35],
      [3.76, 0.22],
      [5.4, 0.1],
    ];
    partials.forEach(([ratio, amp]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const g = ctx.createGain();
      g.gain.value = amp;
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 4.8);
    });
    setTimeout(() => ctx.close(), 5500);
  } catch {}
}
