import { getMelody } from "./melodies";

/** Frecuencias de notas de piano para Golden Hour (JVKE) */
const NOTE_FREQ: Record<string, number> = {
  E2: 82.41, Gs2: 103.83, B2: 123.47,
  Ds3: 155.56, E3: 164.81, Fs3: 185.00, Gs3: 207.65, As3: 233.08, B3: 246.94,
  Cs4: 277.18, Ds4: 311.13, E4: 329.63, Fs4: 369.99, Gs4: 415.30, As4: 466.16, B4: 493.88,
  Cs5: 554.37, Ds5: 622.25, E5: 659.25, Fs5: 739.99, Gs5: 830.61, As5: 932.33, B5: 987.77,
  Cs6: 1108.73, Ds6: 1244.51, E6: 1318.51, Fs6: 1479.98
};

// Los arpegios clásicos de Golden Hour (JVKE) en piano:
// Progresión: E -> B -> G#m -> F#
const GOLDEN_HOUR_CHORDS = [
  {
    bass: ["E2", "E3"],
    arp: ["E4", "Gs4", "B4", "E5", "Gs5", "B5", "E6", "B5", "Gs5", "E5", "B4", "Gs4"]
  },
  {
    bass: ["B2", "Ds3"],
    arp: ["Ds4", "Fs4", "B4", "Ds5", "Fs5", "B5", "Ds6", "B5", "Fs5", "Ds5", "B4", "Fs4"]
  },
  {
    bass: ["Gs2", "Ds3"],
    arp: ["Ds4", "Gs4", "B4", "Ds5", "Gs5", "B5", "Ds6", "B5", "Gs5", "Ds5", "B4", "Gs4"]
  },
  {
    bass: ["Fs2", "Cs3"],
    arp: ["Cs4", "Fs4", "As4", "Cs5", "Fs5", "As5", "Cs6", "As5", "Fs5", "Cs5", "As4", "Fs4"]
  }
];

/** Motor de audio avanzado: Golden Hour en piano + Pistas de recuerdos */
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
  private bgStep = 0;
  private bgChordIdx = 0;

  private ensureCtx() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  /** Toca una nota individual de piano acústico con armónicos */
  private playPianoNote(freq: number, time: number, duration: number, gainValue = 0.15, dest: AudioNode = this.ctx!.destination) {
    if (!this.ctx) return;
    const c = this.ctx;

    // Oscilador fundamental
    const osc1 = c.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    // Segundo armónico para dar brillo de cuerda de piano
    const osc2 = c.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time);

    // Tercer armónico sutil
    const osc3 = c.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(freq * 3, time);

    const noteGain = c.createGain();
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(gainValue, time + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(noteGain);
    
    const armGain = c.createGain();
    armGain.gain.value = 0.35;
    osc2.connect(armGain).connect(noteGain);
    
    const armGain3 = c.createGain();
    armGain3.gain.value = 0.15;
    osc3.connect(armGain3).connect(noteGain);

    noteGain.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);

    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
    osc3.stop(time + duration + 0.1);
  }

  /** Inicia la música de fondo: Golden Hour en piano */
  async startBackgroundGoldenHour() {
    if (this.isMuted) return;
    const ctx = this.ensureCtx();
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }

    if (this.isBgPlaying) return;
    this.isBgPlaying = true;

    // Configurar master con reverb/delay acústico cálido
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 1.2);

    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.38;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.25;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    this.bgMaster = master;
    this.bgStep = 0;
    this.bgChordIdx = 0;

    // Intervalo de arpegio rápido (estilo Golden Hour piano)
    const stepInterval = 115; // ms por nota de arpegio
    const notesPerChord = 12;

    this.bgTimer = setInterval(() => {
      if (!this.ctx || !this.bgMaster || !this.isBgPlaying || this.isMuted) return;
      const c = this.ctx;
      const t = c.currentTime;

      const chord = GOLDEN_HOUR_CHORDS[this.bgChordIdx % GOLDEN_HOUR_CHORDS.length];
      
      // Al inicio de cada acorde tocar los bajos de piano
      if (this.bgStep === 0) {
        chord.bass.forEach(bNote => {
          const freq = NOTE_FREQ[bNote];
          if (freq) this.playPianoNote(freq, t, 3.2, 0.28, this.bgMaster!);
        });
      }

      // Tocar la nota del arpegio
      const arpNote = chord.arp[this.bgStep % chord.arp.length];
      const freq = NOTE_FREQ[arpNote];
      if (freq) {
        this.playPianoNote(freq, t, 1.4, 0.16, this.bgMaster!);
      }

      this.bgStep++;
      if (this.bgStep >= notesPerChord) {
        this.bgStep = 0;
        this.bgChordIdx = (this.bgChordIdx + 1) % GOLDEN_HOUR_CHORDS.length;
      }
    }, stepInterval);
  }

  /** Pausa temporal de Golden Hour (al abrir una tarjeta de foto/video) */
  pauseBackground() {
    this.isBgPlaying = false;
    if (this.bgTimer) {
      clearInterval(this.bgTimer);
      this.bgTimer = null;
    }
    if (this.bgMaster && this.ctx) {
      this.bgMaster.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgMaster.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          this.bgMaster?.disconnect();
          this.bgMaster = null;
        } catch {}
      }, 500);
    }
  }

  /** Reanuda Golden Hour (al cerrar la tarjeta de foto/video) */
  async resumeBackground() {
    this.stopCardAudio();
    if (!this.isMuted) {
      await this.startBackgroundGoldenHour();
    }
  }

  /** Reproduce el audio/canción específico de una tarjeta */
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
      this.startBackgroundGoldenHour();
    }
  }
}

export const musicEngine = new MusicEngine();
