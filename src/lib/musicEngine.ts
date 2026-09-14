import { getMelody } from "./melodies";

/** Motor de música ambiental generada en el navegador (Web Audio API). */
class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private padNodes: OscillatorNode[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private audioEl: HTMLAudioElement | null = null;

  private ensureCtx() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  /** Reproduce una pista de audio subida por la usuaria. */
  async playFile(url: string) {
    this.stop();
    const el = new Audio(url);
    el.loop = true;
    el.volume = 0.85;
    this.audioEl = el;
    try {
      await el.play();
    } catch {
      /* el navegador puede bloquear autoplay */
    }
  }

  /** Reproduce una melodía generada. */
  async playMelody(key: string) {
    this.stop();
    const melody = getMelody(key);
    const ctx = this.ensureCtx();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);
    this.master = master;

    melody.pad.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain).connect(g.gain);
      osc.connect(g).connect(master);
      osc.start();
      lfo.start();
      this.padNodes.push(osc, lfo);
    });

    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);

    this.step = 0;
    this.timer = setInterval(() => {
      if (!this.ctx || !this.master) return;
      const c = this.ctx;
      const note = melody.scale[this.step % melody.scale.length]! * (this.step % 7 === 6 ? 0.5 : 1);
      this.step += this.step % 3 === 0 ? 2 : 1;
      const t = c.currentTime;
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note, t);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      osc.connect(g).connect(this.master);
      osc.start(t);
      osc.stop(t + 2.5);
    }, melody.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }
    const ctx = this.ctx;
    const master = this.master;
    const pads = this.padNodes;
    this.master = null;
    this.padNodes = [];
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        pads.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* ya detenido */
          }
        });
        try {
          master.disconnect();
        } catch {
          /* noop */
        }
      }, 700);
    }
  }
}

export const musicEngine = new MusicEngine();
