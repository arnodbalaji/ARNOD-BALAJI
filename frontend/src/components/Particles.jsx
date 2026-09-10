import { useEffect, useRef } from "react";

export default function Particles({ count = 36 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const embers = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.2,
      speed: 0.0006 + Math.random() * 0.0014,
      drift: (Math.random() - 0.5) * 0.0004,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y -= e.speed;
        e.x += e.drift;
        if (e.y < -0.05) {
          e.y = 1.05;
          e.x = Math.random();
        }
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + e.phase));
        const x = e.x * w;
        const y = e.y * h;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, e.r * 5);
        grad.addColorStop(0, `rgba(243, 229, 171, ${0.8 * tw})`);
        grad.addColorStop(0.4, `rgba(255, 140, 0, ${0.35 * tw})`);
        grad.addColorStop(1, "rgba(255, 140, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, e.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
