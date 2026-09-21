import React, { useState, useEffect, useRef } from "react";
import { X, RotateCcw, Volume2, VolumeX, Music } from "lucide-react";

interface SunflowerInteractiveProps {
  onClose?: () => void;
  audioUrl?: string | null;
}

interface TreeBranch {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  delay: number;
}

interface TreeFlower {
  id: number;
  x: number;
  y: number;
  size: number;
  batch: number;
}

interface LyricLine {
  time: number;
  text: string;
}

// Letra EXACTA y oficial de "Tú Me Encantas" - 3AM
const LYRICS: LyricLine[] = [
  { time: 0.0, text: "🎶 (Intro - Tú Me Encantas • 3AM) 🌻" },
  { time: 6.2, text: "Tú me encantas, no lo puedo negar" },
  { time: 9.8, text: "Tu carita me tiene flotando en otro lugar" },
  { time: 13.5, text: "No hay nadie como tú, baby, qué bendición" },
  { time: 17.0, text: "Cada segundo a tu lado me llena el corazón" },
  { time: 20.8, text: "Y es que me vuelves loco cuando me miras así" },
  { time: 24.5, text: "No existe nada más lindo que hacerte sonreír" },
  { time: 28.5, text: "Tú me encantas... de la cabeza a los pies" },
  { time: 32.2, text: "Y si volviera a nacer, te elegiría otra vez" },
  { time: 36.0, text: "Porque tú tienes esa magia que nadie más tiene" },
  { time: 40.0, text: "Eres mi luz, mi paz, lo más bonito que me sostiene ✨" },
  { time: 44.5, text: "🌻 ¡Feliz Día de las Flores Amarillas! 💛" },
  { time: 48.0, text: "Eres el sol que hace florecer cada uno de mis días." },
];

export function SunflowerInteractive({ onClose, audioUrl = "/music/3AM-Tu_Me_Encantas.mp3" }: SunflowerInteractiveProps) {
  const [clickedInitial, setClickedInitial] = useState(false);
  const [stage, setStage] = useState<"initial" | "growing-tree" | "blooming-flowers" | "shift-and-text" | "completed">("initial");
  const [visibleBatches, setVisibleBatches] = useState<number>(0);
  const [typedPoem, setTypedPoem] = useState("");
  const [isPoemDone, setIsPoemDone] = useState(false);
  const [flowers, setFlowers] = useState<TreeFlower[]>([]);
  const [branches, setBranches] = useState<TreeBranch[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const poemText = `🌻 FELIZ DÍA DE LAS FLORES AMARILLAS 🌻\n\nCADA GIRASOL QUE VES AQUÍ ES UN LATIDO DE MI CORAZÓN.\nASÍ COMO EL SOL ILUMINA LOS CAMPOS, TÚ ILUMINAS MI VIDA.\nQUE ESTAS FLORES TE RECUERDEN LO ESPECIAL QUE ERES PARA MÍ.\n\n- ¡TE AMO! 💛`;
  const footerText = "Eres el sol que hace florecer cada uno de mis días.";

  useEffect(() => {
    // 1. Árbol alto con ramas orgánicas
    const branchList: TreeBranch[] = [
      { x1: 200, y1: 370, x2: 200, y2: 220, width: 15, delay: 0 },
      { x1: 200, y1: 260, x2: 140, y2: 170, width: 10, delay: 800 },
      { x1: 200, y1: 250, x2: 260, y2: 165, width: 10, delay: 950 },
      { x1: 200, y1: 210, x2: 195, y2: 120, width: 8, delay: 1100 },
      { x1: 140, y1: 170, x2: 95, y2: 120, width: 6, delay: 1500 },
      { x1: 140, y1: 170, x2: 165, y2: 110, width: 5.5, delay: 1650 },
      { x1: 260, y1: 165, x2: 305, y2: 115, width: 6, delay: 1750 },
      { x1: 260, y1: 165, x2: 235, y2: 105, width: 5.5, delay: 1850 },
      { x1: 95, y1: 120, x2: 65, y2: 85, width: 4, delay: 2200 },
      { x1: 305, y1: 115, x2: 335, y2: 80, width: 4, delay: 2350 },
    ];
    setBranches(branchList);

    // 2. Coordenadas de corazón
    const flowerList: TreeFlower[] = [];
    let id = 0;
    const totalPoints = 110;

    for (let i = 0; i < totalPoints; i++) {
      const t = (Math.PI * 2 * i) / totalPoints;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const scale = 7.8;
      const x = 200 + hx * scale + (Math.random() * 8 - 4);
      const y = 130 + hy * scale + (Math.random() * 8 - 4);
      const size = 16 + Math.random() * 8;
      const batch = Math.floor((i / totalPoints) * 10);

      flowerList.push({ id: id++, x, y, size, batch });
    }

    for (let layer = 0.25; layer <= 0.85; layer += 0.2) {
      const innerCount = Math.floor(totalPoints * layer * 0.75);
      for (let j = 0; j < innerCount; j++) {
        const t = (Math.PI * 2 * j) / innerCount;
        const hx = 16 * Math.pow(Math.sin(t), 3) * layer;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * layer;
        
        const scale = 7.8;
        const x = 200 + hx * scale + (Math.random() * 10 - 5);
        const y = 130 + hy * scale + (Math.random() * 10 - 5);
        const size = 15 + Math.random() * 9;
        const batch = 4 + Math.floor(Math.random() * 8);

        flowerList.push({ id: id++, x, y, size, batch });
      }
    }

    setFlowers(flowerList);
  }, []);

  // Audio sincronizado (Solo UNA instancia controlada)
  useEffect(() => {
    if (!clickedInitial) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl ?? "/music/3AM-Tu_Me_Encantas.mp3");
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.85;
    audio.play().catch((err) => console.warn("Audio play blocked", err));

    const onTimeUpdate = () => {
      const curr = audio.currentTime;
      let activeIdx = 0;
      for (let i = 0; i < LYRICS.length; i++) {
        if (curr >= LYRICS[i].time) {
          activeIdx = i;
        }
      }
      setCurrentLyricIndex(activeIdx);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.pause();
      audioRef.current = null;
    };
  }, [clickedInitial, audioUrl]);

  const handleStart = () => {
    if (clickedInitial) return;
    setClickedInitial(true);
    setStage("growing-tree");

    setTimeout(() => {
      setStage("blooming-flowers");
      let currentBatch = 0;
      const batchInterval = setInterval(() => {
        currentBatch++;
        setVisibleBatches(currentBatch);
        if (currentBatch >= 12) {
          clearInterval(batchInterval);
          setTimeout(() => {
            setStage("shift-and-text");
          }, 800);
        }
      }, 350);
    }, 2400);
  };

  useEffect(() => {
    if (stage === "shift-and-text" || stage === "completed") {
      let currentIdx = 0;
      setTypedPoem("");
      setIsPoemDone(false);

      const interval = setInterval(() => {
        if (currentIdx < poemText.length) {
          setTypedPoem(poemText.slice(0, currentIdx + 1));
          currentIdx++;
        } else {
          setIsPoemDone(true);
          setStage("completed");
          clearInterval(interval);
        }
      }, 38);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setClickedInitial(false);
    setStage("initial");
    setVisibleBatches(0);
    setTypedPoem("");
    setIsPoemDone(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[640px] w-full max-w-4xl mx-auto p-4 sm:p-8 overflow-hidden rounded-3xl bg-[#f6f5ef] border border-stone-300 shadow-2xl text-stone-900 select-none font-serif">
      {/* Botón Cerrar */}
      {onClose && (
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-stone-200/80 border border-stone-300 text-stone-700 hover:text-stone-950 hover:bg-stone-300 transition-all cursor-pointer shadow-sm"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Control de sonido */}
      {clickedInitial && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 border border-stone-300 text-xs font-sans font-semibold text-stone-800 shadow hover:bg-stone-300 transition-all cursor-pointer"
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-600" />
              <span>Sin Sonido</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span className="truncate max-w-[140px]">Tú Me Encantas • 3AM</span>
            </>
          )}
        </button>
      )}

      {/* Pantalla 1: Girasol individual inicial PERFECTAMENTE CENTRADO */}
      {!clickedInitial ? (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div
            onClick={handleStart}
            className="group relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {/* Flor concéntrica */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Pétalos radiales */}
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 sm:w-7 h-22 sm:h-26 origin-bottom -translate-x-1/2 -translate-y-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${i * 15}deg)`,
                    }}
                  >
                    <div className="w-full h-full rounded-t-full bg-gradient-to-t from-[#f59e0b] via-[#fbbf24] to-[#fde68a] border-t border-amber-200 shadow-sm" />
                  </div>
                ))}
              </div>
              {/* Centro de semillas */}
              <div className="relative z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-[#381e09] border-4 border-[#59300e] shadow-inner flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-dashed border-amber-600/40" />
              </div>
            </div>

            {/* Texto de ayuda "Click Aquí" */}
            <div className="absolute top-1/2 -right-24 -translate-y-1/2 flex items-center gap-2 font-sans font-medium text-stone-700 text-sm bg-white/90 px-3 py-1.5 rounded-full shadow border border-stone-200 animate-bounce">
              <span>👈 Click Aquí</span>
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla 2: Escenario con Árbol alto, Poema y Letra Sincronizada */
        <div className="relative w-full min-h-[520px] flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-700 overflow-hidden pb-12">
          
          {/* Línea horizontal del suelo */}
          <div className="absolute bottom-16 left-4 right-4 h-[2px] bg-stone-800 pointer-events-none opacity-80" />

          {/* Lado Izquierdo: Poema */}
          <div className={`z-20 w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 transition-all duration-1000 ${
            stage === "shift-and-text" || stage === "completed" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
          }`}>
            <div className="whitespace-pre-line text-sm sm:text-base font-serif font-medium text-stone-900 leading-relaxed tracking-wide min-h-[220px]">
              {typedPoem}
              {!isPoemDone && <span className="inline-block w-2 h-4 bg-amber-600 ml-1 animate-pulse" />}
            </div>

            {stage === "completed" && (
              <div className="mt-6 pt-3 border-t border-stone-300 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-xs sm:text-sm italic text-stone-600 font-serif">
                  &ldquo;{footerText}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-sans font-semibold underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Volver a reproducir animación
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lado Derecho: Árbol + Letra sincronizada debajo */}
          <div className={`relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center transition-all duration-1000 ${
            stage === "shift-and-text" || stage === "completed" ? "md:translate-x-4" : "mx-auto"
          }`}>
            <div className="relative w-[340px] h-[370px] sm:w-[390px] sm:h-[400px]">
              <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                {/* Tronco y Ramas */}
                <g className={`transition-opacity duration-700 ${stage !== "initial" ? "opacity-100" : "opacity-0"}`}>
                  <path
                    d="M 192 370 L 195 220 L 205 220 L 208 370 Z"
                    fill="#155e42"
                    className={`transition-all duration-1000 ease-out origin-bottom ${
                      stage !== "initial" ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  
                  {branches.map((b, bi) => (
                    <line
                      key={bi}
                      x1={b.x1}
                      y1={b.y1}
                      x2={b.x2}
                      y2={b.y2}
                      stroke="#155e42"
                      strokeWidth={b.width}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        transitionDelay: `${b.delay}ms`,
                        opacity: stage !== "initial" ? 1 : 0,
                      }}
                    />
                  ))}
                </g>

                {/* Girasoles en Corazón floreciendo en oleadas */}
                <g className={`transition-all duration-700 ${
                  stage !== "initial" && stage !== "growing-tree" ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}>
                  {flowers.map((f) => {
                    const isVisible = f.batch <= visibleBatches;
                    return (
                      <g
                        key={f.id}
                        transform={`translate(${f.x}, ${f.y})`}
                        className={`transition-all duration-500 ease-out ${
                          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
                        }`}
                      >
                        <circle r={f.size / 2} fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                        {Array.from({ length: 8 }).map((_, pi) => {
                          const angle = (360 / 8) * pi;
                          return (
                            <ellipse
                              key={pi}
                              cx="0"
                              cy={-f.size / 2.2}
                              rx={f.size / 6}
                              ry={f.size / 3.2}
                              fill="#fde047"
                              transform={`rotate(${angle})`}
                            />
                          );
                        })}
                        <circle r={f.size / 4.2} fill="#3b1d06" stroke="#231003" strokeWidth="0.5" />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Letra de la canción sincronizada debajo del árbol */}
            <div className="z-30 mt-1 min-h-[44px] flex items-center justify-center px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-600/30 text-stone-900 shadow-sm backdrop-blur-sm transition-all">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-amber-950">
                <Music className="w-3.5 h-3.5 text-amber-700 shrink-0 animate-bounce" />
                <span key={currentLyricIndex} className="animate-in fade-in zoom-in-95 duration-300">
                  {LYRICS[currentLyricIndex]?.text ?? "🎶 ..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
