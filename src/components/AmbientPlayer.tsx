import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

/**
 * Reproductor de música ambiental generada en el navegador (Web Audio API):
 * pads etéreos + arpegio pentatónico con reverb sencilla.
 */
export function AmbientPlayer() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      void ctxRef.current?.close();
    };
  }, []);

  const start = async () => {
    const AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AudioCtor();
    ctxRef.current = ctx;
    await ctx.resume();

    if (!masterRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0;
      const delay = ctx.createDelay(1.2);
      delay.delayTime.value = 0.42;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.34;
      const wet = ctx.createGain();
      wet.gain.value = 0.32;
      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(ctx.destination);
      masterRef.current = master;

      // Pad continuo (acorde suspendido)
      [110, 164.81, 220, 329.63].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = 0.055;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.03;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.03;
        lfo.connect(lfoGain).connect(g.gain);
        osc.connect(g).connect(master);
        osc.start();
        lfo.start();
      });
    }

    const master = masterRef.current!;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5);

    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const c = ctxRef.current;
      if (!c || !masterRef.current) return;
      const note = scale[stepRef.current % scale.length] * (stepRef.current % 7 === 6 ? 0.5 : 1);
      stepRef.current += stepRef.current % 3 === 0 ? 2 : 1;
      const t = c.currentTime;
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note, t);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      osc.connect(g).connect(masterRef.current);
      osc.start(t);
      osc.stop(t + 2.5);
    }, 900);

    setPlaying(true);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-border bg-popover/80 px-4 py-2.5 backdrop-blur-xl neon-ring">
        <button
          type="button"
          onClick={() => (playing ? stop() : void start())}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground transition-transform hover:scale-105"
          style={{ backgroundImage: "var(--gradient-neon)" }}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
        <div className="pr-2">
          <p className="font-display text-[0.7rem] tracking-[0.25em] text-accent uppercase">Nebulosa FM</p>
          <p className="text-xs text-muted-foreground">
            {playing ? "Sonando: Órbita Infinita" : "Toca para viajar con música"}
          </p>
        </div>
        <div className="flex h-8 items-end gap-[3px] pr-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-accent neon-ring-aqua"
              style={{
                height: playing ? `${8 + ((i * 7) % 20)}px` : "4px",
                animation: playing ? `float-slow ${0.9 + i * 0.18}s ease-in-out infinite` : undefined,
              }}
            />
          ))}
        </div>
        <Volume2 className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
