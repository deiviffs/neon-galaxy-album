import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Sun, Play, RotateCcw, X } from "lucide-react";

interface SunflowerInteractiveProps {
  onClose?: () => void;
}

export function SunflowerInteractive({ onClose }: SunflowerInteractiveProps) {
  const [phase, setPhase] = useState<"intro" | "blooming" | "poem">("intro");
  const [bloomedPetals, setBloomedPetals] = useState<number>(0);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const totalPetals = 24;

  useEffect(() => {
    const items = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }));
    setSparks(items);
  }, []);

  useEffect(() => {
    if (phase === "blooming") {
      const interval = setInterval(() => {
        setBloomedPetals((prev) => {
          if (prev < totalPetals) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setPhase("poem"), 800);
            return prev;
          }
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleStartBlooming = () => {
    setPhase("blooming");
    setBloomedPetals(0);
  };

  const handleReset = () => {
    setPhase("intro");
    setBloomedPetals(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[580px] w-full max-w-2xl mx-auto p-6 overflow-hidden rounded-3xl bg-gradient-to-b from-[#140e2b]/95 via-[#1a1138]/95 to-[#0b0817]/95 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-foreground select-none">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/40 border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-300 pointer-events-none animate-pulse"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${2 + (s.delay % 3)}s`,
            animationDelay: `${s.delay}s`,
            opacity: 0.6,
            boxShadow: "0 0 10px #f59e0b",
          }}
        />
      ))}
      <div className="text-center z-10 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Sun className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "10s" }} />
          <span>Recuerdo Especial #31</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
          Un Girasol Que Brilla Para Ti
        </h2>
      </div>
      <div className="relative my-4 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-28 bg-gradient-to-t from-emerald-800 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] z-0 origin-bottom">
          <div className="absolute top-8 -left-7 w-8 h-4 bg-emerald-600 rounded-full -rotate-30 border border-emerald-400/30 shadow-md" />
          <div className="absolute top-14 -right-7 w-8 h-4 bg-emerald-600 rounded-full rotate-30 border border-emerald-400/30 shadow-md" />
        </div>
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center z-10">
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-amber-400/20 blur-xl animate-pulse pointer-events-none" />
          {Array.from({ length: totalPetals }).map((_, i) => {
            const angle = (360 / totalPetals) * i;
            const isBloomed = phase === "intro" ? true : i < bloomedPetals;
            const scale = phase === "intro" ? 0.9 : isBloomed ? 1 : 0;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-6 sm:w-7 h-20 sm:h-24 origin-bottom transition-all duration-500 ease-out pointer-events-none"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg) scale(${scale})`,
                  opacity: isBloomed ? 1 : 0,
                  transitionDelay: phase === "blooming" ? `${i * 30}ms` : "0ms",
                }}
              >
                <div className="w-full h-full rounded-t-full bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 border-t border-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
              </div>
            );
          })}
          <div
            onClick={phase === "intro" ? handleStartBlooming : undefined}
            className={`relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#271003] border-4 border-amber-600/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
              phase === "intro" ? "animate-bounce" : ""
            }`}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/30 opacity-70" />
            <div className="absolute inset-4 rounded-full border border-dotted border-amber-300/40 opacity-50" />
            {phase === "intro" ? (
              <div className="flex flex-col items-center text-center p-1 pointer-events-none">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: "6s" }} />
                <span className="text-[10px] font-bold text-amber-100 uppercase tracking-tighter mt-0.5">
                  ¡Tócame!
                </span>
              </div>
            ) : (
              <Heart className="w-8 h-8 text-amber-400 fill-amber-400/80 animate-pulse" />
            )}
          </div>
        </div>
      </div>
      <div className="w-full text-center z-10 max-w-md min-h-[110px] flex flex-col items-center justify-center">
        {phase === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm sm:text-base text-amber-100/90 italic mb-3">
              "Los girasoles siempre buscan la luz más cálida y brillante... justo como cuando te veo sonreír."
            </p>
            <button
              type="button"
              onClick={handleStartBlooming}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Hacer Florecer el Girasol
            </button>
          </div>
        )}
        {phase === "blooming" && (
          <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              Floreciendo en la galaxia...
            </div>
            <div className="w-48 h-2 bg-black/40 rounded-full overflow-hidden border border-amber-500/30 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-100"
                style={{ width: `${(bloomedPetals / totalPetals) * 100}%` }}
              />
            </div>
          </div>
        )}
        {phase === "poem" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-sans italic">
              🌻 <strong className="text-amber-300 font-semibold">Para ti:</strong> Que en cada etapa y en cada momento de la vida, nunca te falte una razón para iluminar el mundo con tu alegría y tu esencia única.
            </p>
            <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center justify-between">
              <span className="text-xs text-amber-300/80 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Con todo mi cariño ✨
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-amber-400 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Volver a florecer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}