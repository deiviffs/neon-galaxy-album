import { getMelody } from "./melodies";

/** Frecuencias de notas de piano para Interstellar */
const NOTE_FREQ: Record<string, number> = {
  A1: 55.00, B1: 61.74, C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00,
  A2: 110.00, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
  A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.00, B5: 987.77, C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91
};

// Partitura fiel del Tema Principal de Interstellar (First Step / Cornfield Chase de Hans Zimmer)
// Piano Solo: Bajos profundos + Pulsos icónicos 'tun... tun... tun... tun...' + Melodía creciente
const INTERSTELLAR_SCORE = [
  // Sección 1: El pulso hipnótico inicial (A minor -> E minor -> F Major -> G Major)
  { bass: ["A2", "E3"], pulse: "E4", melody: "A4", vel: 0.7, bassVel: 0.8 },
  { bass: [], pulse: "E4", melody: "B4", vel: 0.75, bassVel: 0 },
  { bass: ["A2", "E3"], pulse: "E4", melody: "C5", vel: 0.85, bassVel: 0.7 },
  { bass: [], pulse: "E4", melody: "B4", vel: 0.8, bassVel: 0 },

  { bass: ["E2", "B2"], pulse: "E4", melody: "G4", vel: 0.7, bassVel: 0.8 },
  { bass: [], pulse: "E4", melody: "A4", vel: 0.75, bassVel: 0 },
  { bass: ["E2", "B2"], pulse: "E4", melody: "B4", vel: 0.8, bassVel: 0.7 },
  { bass: [], pulse: "E4", melody: "G4", vel: 0.75, bassVel: 0 },

  { bass: ["F2", "C3"], pulse: "F4", melody: "A4", vel: 0.8, bassVel: 0.85 },
  { bass: [], pulse: "F4", melody: "C5", vel: 0.85, bassVel: 0 },
  { bass: ["F2", "C3"], pulse: "F4", melody: "D5", vel: 0.9, bassVel: 0.75 },
  { bass: [], pulse: "F4", melody: "C5", vel: 0.85, bassVel: 0 },

  { bass: ["G2", "D3"], pulse: "D4", melody: "B4", vel: 0.8, bassVel: 0.8 },
  { bass: [], pulse: "D4", melody: "C5", vel: 0.85, bassVel: 0 },
  { bass: ["G2", "D3"], pulse: "D4", melody: "D5", vel: 0.9, bassVel: 0.75 },
  { bass: [], pulse: "D4", melody: "B4", vel: 0.8, bassVel: 0 },

  // Sección 2: Elevación emocional (Cornfield Chase Clímax en Piano Solo)
  { bass: ["A2", "A3"], pulse: "E4", melody: "E5", vel: 0.95, bassVel: 0.9 },
  { bass: [], pulse: "E4", melody: "D5", vel: 0.9, bassVel: 0 },
  { bass: ["A2", "E3"], pulse: "E4", melody: "C5", vel: 0.95, bassVel: 0.8 },
  { bass: [], pulse: "E4", melody: "B4", vel: 0.85, bassVel: 0 },

  { bass: ["E2", "E3"], pulse: "E4", melody: "G5", vel: 1.0, bassVel: 0.9 },
  { bass: [], pulse: "E4", melody: "Fs5", vel: 0.95, bassVel: 0 },
  { bass: ["E2", "B2"], pulse: "E4", melody: "E5", vel: 0.9, bassVel: 0.8 },
  { bass: [], pulse: "E4", melody: "D5", vel: 0.85, bassVel: 0 },

  { bass: ["F2", "F3"], pulse: "F4", melody: "A5", vel: 1.05, bassVel: 0.95 },
  { bass: [], pulse: "F4", melody: "G5", vel: 1.0, bassVel: 0 },
  { bass: ["F2", "C3"], pulse: "F4", melody: "F5", vel: 0.95, bassVel: 0.85 },
  { bass: [], pulse: "F4", melody: "E5", vel: 0.9, bassVel: 0 },

  { bass: ["G2", "G3"], pulse: "D4", melody: "D5", vel: 0.95, bassVel: 0.9 },
  { bass: [], pulse: "D4", melody: "C5", vel: 0.9, bassVel: 0 },
  { bass: ["G2", "D3"], pulse: "D4", melody: "B4", vel: 0.85, bassVel: 0.8 },
  { bass: [], pulse: "D4", melody: "A4", vel: 0.8, bassVel: 0 }
];

/** Motor de audio: Interstellar Solo Piano + Sistema reactivo visual */
class MusicEngine {
  private ctx: AudioContext | null = null;
  private bgMaster: GainNode | null = null;
  private bgTimer: ReturnType<typeof setInterval> | null = null;
  private cardMaster: GainNode | null = null;
  private cardMelodyTimer: ReturnType<typeof setInterval> | null = null;
  private cardMelodyNodes: OscillatorNode[] = [];
  private cardAudioEl: HTMLAudioElement | null = null;
  
  public isMuted = false;
  public isBgPlaying = false;
  private scoreIndex = 0;

  private ensureCtx() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  /** Sintetizador acústico de piano de cola realista */
  private playPianoNote(freq: number, time: number, duration: number, velocity = 0.8, dest: AudioNode = this.ctx!.destination) {
    if (!this.ctx) return;
    const c = this.ctx;

    // Oscilador 1: Tono fundamental del martillo de piano
    const osc1 = c.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    // Oscilador 2: Cuerda armónica brillante (triángulo)
    const osc2 = c.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time);

    // Oscilador 3: Armónico sutil
    const osc3 = c.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(freq * 3, time);

    // Envolvente de volumen de piano (Ataque rápido de martillo, decaimiento largo natural)
    const noteGain = c.createGain();
    const peakGain = 0.22 * velocity;
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(peakGain, time + 0.008);
    noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.6, time + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(noteGain);
    
    const armGain2 = c.createGain();
    armGain2.gain.value = 0.42;
    osc2.connect(armGain2).connect(noteGain);
    
    const armGain3 = c.createGain();
    armGain3.gain.value = 0.18;
    osc3.connect(armGain3).connect(noteGain);

    noteGain.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);

    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
    osc3.stop(time + duration + 0.1);
  }

  /** Inicia la música de fondo: Interstellar en Solo Piano */
  async startBackgroundInterstellar() {
    if (this.isMuted) return;
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }

    if (this.isBgPlaying) return;
    this.isBgPlaying = true;

    // Sala acústica y resonancia de piano de cola
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.48, ctx.currentTime + 0.8);

    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.45;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    this.bgMaster = master;
    this.scoreIndex = 0;

    // Tempo de Interstellar: ~320ms por pulso de piano ('tun... tun...')
    const beatInterval = 320;

    this.bgTimer = setInterval(() => {
      if (!this.ctx || !this.bgMaster || !this.isBgPlaying || this.isMuted) return;
      const c = this.ctx;
      const t = c.currentTime;

      const step = INTERSTELLAR_SCORE[this.scoreIndex % INTERSTELLAR_SCORE.length]!;

      // 1. Tocar notas de bajo de piano (cuando corresponde al compás)
      if (step.bass.length > 0 && step.bassVel > 0) {
        step.bass.forEach(bNote => {
          const freq = NOTE_FREQ[bNote];
          if (freq) this.playPianoNote(freq, t, 3.8, step.bassVel, this.bgMaster!);
        });
      }

      // 2. Tocar el pulso rítmico constante de piano ('tun... tun...')
      const pulseFreq = NOTE_FREQ[step.pulse];
      if (pulseFreq) {
        this.playPianoNote(pulseFreq, t, 1.2, 0.45, this.bgMaster!);
      }

      // 3. Tocar la melodía de Interstellar
      const melodyFreq = NOTE_FREQ[step.melody];
      if (melodyFreq) {
        this.playPianoNote(melodyFreq, t, 2.2, step.vel, this.bgMaster!);
      }

      // 4. Emitir evento para que las estrellas y la galaxia de fondo reaccionen al toque de piano
      try {
        window.dispatchEvent(
          new CustomEvent("piano-pulse", {
            detail: { intensity: step.vel, note: step.melody }
          })
        );
      } catch {}

      this.scoreIndex = (this.scoreIndex + 1) % INTERSTELLAR_SCORE.length;
    }, beatInterval);
  }

  /** Pausa temporal de Interstellar (al abrir una foto/video) */
  pauseBackground() {
    this.isBgPlaying = false;
    if (this.bgTimer) {
      clearInterval(this.bgTimer);
      this.bgTimer = null;
    }
    if (this.bgMaster && this.ctx) {
      this.bgMaster.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgMaster.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        try {
          this.bgMaster?.disconnect();
          this.bgMaster = null;
        } catch {}
      }, 400);
    }
  }

  /** Reanuda Interstellar (al cerrar la tarjeta de foto/video) */
  async resumeBackground() {
    this.stopCardAudio();
    if (!this.isMuted) {
      await this.startBackgroundInterstellar();
    }
  }

  /** Reproduce el audio/canción específico de una tarjeta */
  async playFile(url: string) {
    return this.playCardFile(url);
  }

  async playMelody(key: string) {
    return this.playCardMelody(key);
  }

  async playCardFile(url: string) {
    this.pauseBackground();
    this.stopCardAudio();
    if (this.isMuted) return;
    
    const el = new Audio(url);
    el.loop = true;
    el.volume = 0.9;
    this.cardAudioEl = el;
    try {
      await el.play();
    } catch {}
  }

  /** Reproduce la melodía ambiental específica de una tarjeta */
  async playCardMelody(key: string) {
    this.pauseBackground();
    this.stopCardAudio();
    if (this.isMuted) return;

    const melody = getMelody(key);
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.6);

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
    this.cardMaster = master;

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
      this.cardMelodyNodes.push(osc, lfo);
    });

    let step = 0;
    this.cardMelodyTimer = setInterval(() => {
      if (!this.ctx || !this.cardMaster || this.isMuted) return;
      const c = this.ctx;
      const note = melody.scale[step % melody.scale.length]! * (step % 7 === 6 ? 0.5 : 1);
      step += step % 3 === 0 ? 2 : 1;
      const t = c.currentTime;
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note, t);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      osc.connect(g).connect(this.cardMaster);
      osc.start(t);
      osc.stop(t + 2.5);
    }, melody.interval);
  }

  /** Detiene el audio de la tarjeta actual */
  stopCardAudio() {
    if (this.cardMelodyTimer) {
      clearInterval(this.cardMelodyTimer);
      this.cardMelodyTimer = null;
    }
    if (this.cardAudioEl) {
      this.cardAudioEl.pause();
      this.cardAudioEl = null;
    }
    const nodes = this.cardMelodyNodes;
    this.cardMelodyNodes = [];
    nodes.forEach(n => {
      try { n.stop(); } catch {}
    });
    if (this.cardMaster && this.ctx) {
      this.cardMaster.gain.cancelScheduledValues(this.ctx.currentTime);
      this.cardMaster.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        try {
          this.cardMaster?.disconnect();
          this.cardMaster = null;
        } catch {}
      }, 400);
    }
  }

  /** Para todo el audio */
  stop() {
    this.pauseBackground();
    this.stopCardAudio();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    } else {
      this.startBackgroundInterstellar();
    }
  }
}

export const musicEngine = new MusicEngine();
