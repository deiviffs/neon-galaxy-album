import React, { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";

interface SunflowerInteractiveProps {
  onClose?: () => void;
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
  delay: number;
}

export function SunflowerInteractive({ onClose }: SunflowerInteractiveProps) {
  const [clickedInitial, setClickedInitial] = useState(false);
  const [stage, setStage] = useState<"initial" | "growing-trunk" | "growing-branches" | "flowers" | "shift-and-text" | "completed">("initial");
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [flowers, setFlowers] = useState<TreeFlower[]>([]);
  const [branches, setBranches] = useState<TreeBranch[]>([]);
  const [fallingPetals, setFallingPetals] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  
  const fullText = `🌻 FELIZ DÍA DE LAS FLORES AMARILLAS 🌻\n\nCADA GIRASOL QUE VES AQUÍ ES UN LATIDO DE MI CORAZÓN.\nASÍ COMO EL SOL ILUMINA LOS CAMPOS, TÚ ILUMINAS MI VIDA.\nQUE ESTAS FLORES TE RECUERDEN LO ESPECIAL QUE ERES PARA MÍ.\n\n- ¡TE AMO! 💛`;
  const footerText = "Eres el sol que hace florecer cada uno de mis días.";

  useEffect(() => {
    // 1. Tronco y ramas con tiempos más pausados y fluidos
    const branchList: TreeBranch[] = [
      { x1: 200, y1: 340, x2: 200, y2: 230, width: 14, delay: 0 },
      { x1: 200, y1: 250, x2: 150, y2: 180, width: 9, delay: 700 },
      { x1: 200, y1: 240, x2: 250, y2: 175, width: 9, delay: 850 },
      { x1: 150, y1: 180, x2: 110, y2: 130, width: 6, delay: 1400 },
      { x1: 150, y1: 180, x2: 170, y2: 120, width: 5, delay: 1550 },
      { x1: 250, y1: 175, x2: 290, y2: 125, width: 6, delay: 1700 },
      { x1: 250, y1: 175, x2: 230, y2: 115, width: 5, delay: 1850 },
      { x1: 200, y1: 210, x2: 195, y2: 135, width: 6, delay: 1200 },
      { x1: 110, y1: 130, x2: 80, y2: 95, width: 4, delay: 2200 },
      { x1: 290, y1: 125, x2: 320, y2: 90, width: 4, delay: 2350 },
    ];
    setBranches(branchList);

    // 2. Coordenadas matemáticas de corazón para distribuir los girasoles progresivamente
    const flowerList: TreeFlower[] = [];
    let id = 0;
    
    const totalPoints = 110;
    for (let i = 0; i < totalPoints; i++) {
      const t = (Math.PI * 2 * i) / totalPoints;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const scale = 7.5;
      const x = 200 + hx * scale + (Math.random() * 8 - 4);
      const y = 135 + hy * scale + (Math.random() * 8 - 4);
      const size = 16 + Math.random() * 8;
      // Florecimiento progresivo y gradual (distribuido a lo largo de 3 segundos)
      const delay = (i / totalPoints) * 2800 + Math.random() * 500;

      flowerList.push({ id: id++, x, y, size, delay });
    }

    // Relleno interno
    for (let layer = 0.25; layer <= 0.85; layer += 0.18) {
      const innerCount = Math.floor(totalPoints * layer * 0.7);
      for (let j = 0; j < innerCount; j++) {
        const t = (Math.PI * 2 * j) / innerCount;
        const hx = 16 * Math.pow(Math.sin(t), 3) * layer;
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * layer;
        
        const scale = 7.5;
        const x = 200 + hx * scale + (Math.random() * 10 - 5);
        const y = 135 + hy * scale + (Math.random() * 10 - 5);
        const size = 15 + Math.random() * 9;
        const delay = 1000 + Math.random() * 2200;

        flowerList.push({ id: id++, x, y, size, delay });
      }
    }

    setFlowers(flowerList);

    const petals = Array.from({ length: 6 }).map((_, pi) => ({
      id: pi,
      x: 140 - pi * 18 + Math.random() * 10,
      y: 190 + pi * 24 + Math.random() * 10,
      delay: 3800 + pi * 500,
    }));
    setFallingPetals(petals);
  }, []);

  const handleStartAnimation = () => {
    if (clickedInitial) return;
    setClickedInitial(true);
    
    // Secuencia con ritmo natural y fluido:
    // 1. Crecimiento del tronco principal
    setStage("growing-trunk");
    setTimeout(() => {
      setStage("growing-branches");
    }, 1000);

    // 2. Comienzan a brotar y florecer los girasoles progresivamente
    setTimeout(() => {
      setStage("flowers");
    }, 2200);

    // 3. Con el corazón formado, se desplaza a la derecha y comienza la escritura del poema
    setTimeout(() => {
      setStage("shift-and-text");
    }, 5600);
  };

  useEffect(() => {
    if (stage === "shift-and-text" || stage === "completed") {
      let currentIdx = 0;
      setTypedText("");
      setIsTypingDone(false);

      const interval = setInterval(() => {
        if (currentIdx < fullText.length) {
          setTypedText(fullText.slice(0, currentIdx + 1));
          currentIdx++;
        } else {
          setIsTypingDone(true);
          setStage("completed");
          clearInterval(interval);
        }
      }, 42);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleReset = () => {
    setClickedInitial(false);
    setStage("initial");
    setTypedText("");
    setIsTypingDone(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[620px] w-full max-w-4xl mx-auto p-4 sm:p-8 overflow-hidden rounded-3xl bg-[#f6f5ef] border border-stone-300 shadow-2xl text-stone-900 select-none font-serif">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-stone-200/80 border border-stone-300 text-stone-700 hover:text-stone-950 hover:bg-stone-300 transition-all cursor-pointer shadow-sm"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {!clickedInitial ? (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div
            onClick={handleStartAnimation}
            className="group relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-5 sm:w-6 h-20 sm:h-24 origin-bottom -translate-x-1/2 -translate-y-full"
                  style={{ transform: `translate(-50%, -100%) rotate(${i * 15}deg)` }}
                >
                  <div className="w-full h-full rounded-t-full bg-gradient-to-t from-[#f59e0b] via-[#fbbf24] to-[#fde68a] border-t border-amber-200 shadow-sm" />
                </div>
              ))}
              <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#381e09] border-2 border-[#59300e] shadow-inner flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-dashed border-amber-600/40" />
              </div>
            </div>

            <div className="absolute top-1/2 -right-24 -translate-y-1/2 flex items-center gap-2 font-sans font-medium text-stone-700 text-sm bg-white/90 px-3 py-1.5 rounded-full shadow border border-stone-200 animate-bounce">
              <span>👈 Click Aquí</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full min-h-[500px] flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-700 overflow-hidden">
          <div className="absolute bottom-16 left-4 right-4 h-[2px] bg-stone-800 pointer-events-none opacity-80" />

          <div className={`z-20 w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 transition-all duration-1000 ${
            stage === "shift-and-text" || stage === "completed" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
          }`}>
            <div className="whitespace-pre-line text-sm sm:text-base font-serif font-medium text-stone-900 leading-relaxed tracking-wide min-h-[220px]">
              {typedText}
              {!isTypingDone && <span className="inline-block w-2 h-4 bg-amber-600 ml-1 animate-pulse" />}
            </div>

            {stage === "completed" && (
              <div className="mt-8 pt-4 border-t border-stone-300 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-xs sm:text-sm italic text-stone-600 font-serif">
                  &ldquo;{footerText}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-4">
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

          <div className={`relative z-10 w-full md:w-1/2 flex items-center justify-center transition-all duration-1000 ${
            stage === "shift-and-text" || stage === "completed" ? "md:translate-x-4" : "mx-auto"
          }`}>
            <div className="relative w-[340px] h-[360px] sm:w-[400px] sm:h-[390px]">
              <svg viewBox="0 0 400 380" className="w-full h-full overflow-visible">
                <g className={`transition-opacity duration-700 ${stage !== "initial" ? "opacity-100" : "opacity-0"}`}>
                  <path
                    d="M 193 350 L 195 240 L 205 240 L 207 350 Z"
                    fill="#155e42"
                    className={`transition-all duration-1000 ease-out origin-bottom ${
                      stage === "growing-trunk" || stage === "growing-branches" || stage === "flowers" || stage === "shift-and-text" || stage === "completed"
                        ? "scale-y-100"
                        : "scale-y-0"
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
                        opacity: stage !== "initial" && stage !== "growing-trunk" ? 1 : 0,
                      }}
                    />
                  ))}
                </g>

                <g className={`transition-all duration-700 ${
                  stage === "flowers" || stage === "shift-and-text" || stage === "completed" ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}>
                  {flowers.map((f) => (
                    <g
                      key={f.id}
                      transform={`translate(${f.x}, ${f.y})`}
                      className="transition-all duration-700 ease-out hover:scale-125"
                      style={{
                        transitionDelay: `${f.delay}ms`,
                      }}
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
                  ))}
                </g>

                {(stage === "shift-and-text" || stage === "completed") && (
                  <g className="animate-in fade-in duration-1000">
                    {fallingPetals.map((p) => (
                      <g key={p.id} transform={`translate(${p.x}, ${p.y})`} className="animate-bounce" style={{ animationDuration: '3s' }}>
                        <circle r="4.5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
                        <circle r="1.8" fill="#3b1d06" />
                      </g>
                    ))}
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
