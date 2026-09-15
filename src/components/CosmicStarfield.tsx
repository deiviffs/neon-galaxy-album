import { useEffect, useRef } from "react";

export function CosmicStarfield({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef<number>(0);
  const rippleStars = useRef<Array<{ x: number; y: number; size: number; alpha: number; maxAlpha: number; color: string; speed: number; phase: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#ff71ce", "#01cdfe", "#b967ff", "#fffb96", "#ffffff", "#05ffa1"];

    const initStars = () => {
      const count = Math.min(180, Math.floor((width * height) / 9000));
      rippleStars.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        maxAlpha: Math.random() * 0.8 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        speed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    initStars();

    // Escuchar el pulso del piano de Interstellar
    const handlePianoPulse = (e: Event) => {
      const custom = e as CustomEvent<{ intensity: number }>;
      const boost = (custom.detail?.intensity ?? 1) * 1.5;
      pulseRef.current = Math.min(pulseRef.current + boost, 2.5);
    };

    window.addEventListener("piano-pulse", handlePianoPulse);

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Decaimiento suave del pulso del piano
      pulseRef.current *= 0.92;
      const currentPulse = pulseRef.current;

      // Resplandor de nebulosa reactiva en el centro / fondo
      if (currentPulse > 0.05) {
        const rad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          20,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.7
        );
        rad.addColorStop(0, `rgba(255, 113, 206, ${currentPulse * 0.12})`);
        rad.addColorStop(0.4, `rgba(1, 205, 254, ${currentPulse * 0.08})`);
        rad.addColorStop(0.8, `rgba(185, 103, 255, ${currentPulse * 0.05})`);
        rad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, width, height);
      }

      // Dibujar y animar estrellas
      const stars = rippleStars.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]!;
        s.phase += s.speed;

        // El brillo aumenta con cada toque del piano de Interstellar
        const twinkle = (Math.sin(s.phase) + 1) / 2;
        const currentAlpha = Math.min(1, s.alpha * twinkle + currentPulse * 0.6);
        const currentSize = s.size * (1 + currentPulse * 0.8);

        ctx.beginPath();
        ctx.arc(s.x, s.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // Destello en cruz en estrellas grandes cuando hay pulso de piano fuerte
        if (s.size > 1.8 && currentPulse > 0.25) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(s.x - currentSize * 3, s.y);
          ctx.lineTo(s.x + currentSize * 3, s.y);
          ctx.moveTo(s.x, s.y - currentSize * 3);
          ctx.lineTo(s.x, s.y + currentSize * 3);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("piano-pulse", handlePianoPulse);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-700"
      aria-hidden
    />
  );
}
