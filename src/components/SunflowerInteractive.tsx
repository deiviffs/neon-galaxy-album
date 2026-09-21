import React, { useState, useEffect, useRef } from "react";
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
  batch: number;
}

export function SunflowerInteractive({ onClose }: SunflowerInteractiveProps) {
  const [clickedInitial, setClickedInitial] = useState(false);
  const [stage, setStage] = useState<"initial" | "growing-tree" | "blooming-flowers" | "shift-and-text" | "completed">("initial");
  const [visibleBatches, setVisibleBatches] = useState<number>(0);
  const [typedPoem, setTypedPoem] = useState("");
  const [isPoemDone, setIsPoemDone] = useState(false);
  const [flowers, setFlowers] = useState<TreeFlower[]>([]);
  const [branches, setBranches] = useState<TreeBranch[]>([]);

  // Refs de seguridad para que los timers NUNCA se ejecuten dos veces
  const timerStartedRef = useRef(false);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const batchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stageTimeout1Ref = useRef<NodeJS.Timeout | null>(null);
  const stageTimeout2Ref = useRef<NodeJS.Timeout | null>(null);

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

    return () => {
      // Limpiar al desmontar
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (batchIntervalRef.current) clearInterval(batchIntervalRef.current);
      if (stageTimeout1Ref.current) clearTimeout(stageTimeout1Ref.current);
      if (stageTimeout2Ref.current) clearTimeout(stageTimeout2Ref.current);
    };
  }, []);

  const handleStart = () => {
    if (clickedInitial || timerStartedRef.current) return;
    timerStartedRef.current = true;
    setClickedInitial(true);
    setStage("growing-tree");

    stageTimeout1Ref.current = setTimeout(() => {
      setStage("blooming-flowers");
      let currentBatch = 0;
      batchIntervalRef.current = setInterval(() => {
        currentBatch++;
        setVisibleBatches(currentBatch);
        if (currentBatch >= 12) {
          if (batchIntervalRef.current) clearInterval(batchIntervalRef.current);
          stageTimeout2Ref.current = setTimeout(() => {
            setStage("shift-and-text");
            // INICIAR ESCRITURA DIRECTA SIN DEPENDER DE RE-RENDERS
            startTyping();
          }, 800);
        }
      }, 350);
    }, 2400);
  };

  const startTyping = () => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    let currentIdx = 0;
    setTypedPoem("");
    setIsPoemDone(false);

    typeIntervalRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx <= poemText.length) {
        setTypedPoem(poemText.slice(0, currentIdx));
      } else {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setIsPoemDone(true);
        setStage("completed"); // Estado final definitivo. NADA lo volverá a reiniciar
      }
    }, 40);
  };

  const handleReset = () => {
    // Limpiar todos los intervalos y timers activos
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    if (batchIntervalRef.current) clearInterval(batchIntervalRef.current);
    if (stageTimeout1Ref.current) clearTimeout(stageTimeout1Ref.current);
    if (stageTimeout2Ref.current) clearTimeout(stageTimeout2Ref.current);

    timerStartedRef.current = false;
    setClickedInitial(false);
    setStage("initial");
    setVisibleBatches(0);
    setTypedPoem("");
    setIsPoemDone(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[640px] w-full max-w-4xl mx-auto p-4 sm:p-8 overflow-hidden rounded-3xl bg-[#f6f5ef] border border-stone-300 shadow-2xl text-stone-900 select-none font-serif">
      {/* Botón Cerrar */}
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

      {/* Pantalla 1: Girasol individual inicial SVG */}
      {!clickedInitial ? (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
          <div
            onClick={handleStart}
            className="group relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible">
              <g transform="translate(100, 100)">
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (360 / 24) * i;
                  return (
                    <g key={i} transform={`rotate(${angle})`}>
                      <ellipse
                        cx="0"
                        cy="-62"
                        rx="12"
                        ry="30"
                        fill="#fbbf24"
                        stroke="#f59e0b"
                        strokeWidth="0.8"
                      />
                    </g>
                  );
                })}
                <circle r="36" fill="#301503" stroke="#4a2205" strokeWidth="2" />
                <circle r="22" fill="#200d02" opacity="0.6" />
              </g>
            </svg>

            <div className="absolute top-1/2 -right-24 -translate-y-1/2 flex items-center gap-2 font-sans font-medium text-stone-700 text-sm bg-white/90 px-3 py-1.5 rounded-full shadow border border-stone-200 animate-bounce">
              <span>👈 Click Aquí</span>
            </div>
          </div>
        </div>
      ) : (
        /* Pantalla 2: Escenario limpio con Árbol y Poema */
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

            {/* Frase final y botón "Volver a reproducir animación" */}
            {stage === "completed" && (
              <div className="mt-6 pt-3 border-t border-stone-400 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-xs sm:text-sm italic font-serif font-bold text-stone-800">
                  &ldquo;{footerText}&rdquo;
                </p>
                <div className="mt-4 flex items-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-sans font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-950" />
                    <span>Volver a reproducir animación</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lado Derecho: Árbol alto de Girasoles en Corazón */}
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
          </div>
        </div>
      )}
    </div>
  );
}
