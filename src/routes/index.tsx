import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Film, Music, Pencil, Play, Plus, RotateCcw, Sparkles, Sun, Volume2, VolumeX, X } from "lucide-react";
import { PlateEditor } from "@/components/PlateEditor";
import { SunflowerInteractive } from "@/components/SunflowerInteractive";
import { deletePlate, isMediaVideo, loadPlates, plateImageSrc, resetToDefaultPlates, savePlate, DEFAULT_PLATES, type Plate } from "@/lib/album";
import { getMelody } from "@/lib/melodies";
import { musicEngine } from "@/lib/musicEngine";
import interstellarAudioUrl from "@/assets/audio/interstellar-piano.mp3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Álbum Galaxia Neón ✨ Recuerdos Cósmicos" },
      {
        name: "description",
        content:
          "Álbum cósmico con fotos, videos, mensajes románticos y música. Flotación cósmica y rotación interactiva.",
      },
      { property: "og:title", content: "Álbum Galaxia Neón" },
      {
        property: "og:description",
        content: "Recuerdos flotando en la galaxia cósmica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [plates, setPlates] = useState<Plate[]>(DEFAULT_PLATES);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ plate: Plate; isNew: boolean } | null>(null);
  const [muted, setMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const urlCache = useRef(new Map<string, string>());
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Intentar iniciar el audio de Interstellar en la primera interacción o carga
  useEffect(() => {
    const playBg = () => {
      if (bgAudioRef.current && !muted && !openId) {
        bgAudioRef.current.volume = 0.75;
        bgAudioRef.current.play().catch(() => {});
      }
    };

    playBg();

    const unlock = () => {
      playBg();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [muted, openId]);
  const track = useRef<HTMLDivElement>(null);

  // Arrastre con el mouse / touch
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const resumeTimer = useRef<number | null>(null);

  const fetchPlates = useCallback(async () => {
    const list = await loadPlates();
    setPlates(list);
  }, []);

  useEffect(() => {
    void fetchPlates();
    return () => musicEngine.stop();
  }, [fetchPlates]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passwordInput.trim().toUpperCase();
    if (clean === "JOSEFINA") {
      setIsUnlocked(true);
      setMuted(false);
      
      // Reproducir inmediatamente el piano de Interstellar en el clic de desbloqueo
      if (bgAudioRef.current) {
        bgAudioRef.current.muted = false;
        bgAudioRef.current.volume = 0.75;
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play().catch((err) => {
          console.warn("Audio autoplay blocked, waiting next interaction", err);
        });
      }
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2500);
    }
  };

  const handleResetMemories = async () => {
    if (window.confirm("¿Deseas restaurar todas las tarjetas de recuerdos con las fotos, videos y música?")) {
      const resetList = await resetToDefaultPlates();
      setPlates(resetList);
      if (openId) close();
    }
  };

  const open = useMemo(() => plates.find((p) => p.id === openId) ?? null, [plates, openId]);

  const playFor = useCallback(
    (plate: Plate) => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      if (muted) return;
      setIsPlayingAudio(true);
      if (plate.audioBlob) {
        const key = `aud-${plate.id}`;
        let url = urlCache.current.get(key);
        if (!url) {
          url = URL.createObjectURL(plate.audioBlob);
          urlCache.current.set(key, url);
        }
        void musicEngine.playFile(url);
      } else if (plate.audioUrl) {
        void musicEngine.playFile(plate.audioUrl);
      } else {
        void musicEngine.playMelody(plate.melody);
      }
    },
    [muted],
  );

  const close = useCallback(() => {
    setOpenId(null);
    setIsPlayingAudio(false);
    musicEngine.stop();
    if (bgAudioRef.current && !muted) {
      bgAudioRef.current.volume = 0.75;
      bgAudioRef.current.play().catch(() => {});
    }
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const pauseInteraction = useCallback((durationMs = 2500) => {
    setIsUserInteracting(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, durationMs);
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    pauseInteraction(3500);
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // Duplicar para bucle continuo fluido e infinito sin saltos
  const looped = useMemo(() => {
    if (!plates.length) return [];
    if (plates.length < 15) return [...plates, ...plates, ...plates];
    return [...plates, ...plates];
  }, [plates]);

  // Movimiento ultra fluido a 60/120fps basado en tiempo real (Lag-free)
  useEffect(() => {
    if (open || editing || looped.length < 2) return;
    let raf = 0;
    let lastTime = performance.now();
    const pxPerSecond = 28; // Velocidad suave, constante y relajante

    const step = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const el = track.current;
      if (el && !isUserInteracting && !isDragging.current) {
        const maxLoop = el.scrollWidth / 2;
        if (maxLoop > 0 && el.scrollLeft >= maxLoop) {
          el.scrollLeft -= maxLoop;
        }
        el.scrollLeft += pxPerSecond * delta;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isUserInteracting, open, editing, looped.length, plates.length, isUnlocked]);

  // Manejador táctil y de ratón ultra responsivo y sin lag para móviles
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = track.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    setIsUserInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const el = track.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.0;
    let target = scrollLeftStart.current - walk;
    const maxLoop = el.scrollWidth / 2;

    if (maxLoop > 0) {
      if (target < 0) {
        target += maxLoop;
        scrollLeftStart.current += maxLoop;
      } else if (target >= maxLoop * 2) {
        target -= maxLoop;
        scrollLeftStart.current -= maxLoop;
      }
    }
    el.scrollLeft = target;
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      pauseInteraction(1200);
    }
  };

  const handleSave = async (plate: Plate) => {
    urlCache.current.delete(`img-${plate.id}`);
    urlCache.current.delete(`aud-${plate.id}`);
    await savePlate(plate);
    setPlates((prev) =>
      prev.some((p) => p.id === plate.id)
        ? prev.map((p) => (p.id === plate.id ? plate : p))
        : [...prev, plate],
    );
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deletePlate(id);
    setPlates((prev) => prev.filter((p) => p.id !== id));
    setEditing(null);
    if (openId === id) close();
  };

  const addNew = () => {
    setEditing({
      isNew: true,
      plate: {
        id: `p-${Date.now()}`,
        title: "Nuevo recuerdo",
        tag: `${String(plates.length + 1).padStart(2, "0")} • Estrella`,
        message: "Eres mi lugar favorito del universo ✨💫",
        imageUrl: null,
        imageBlob: null,
        melody: "cristal",
        audioBlob: null,
        audioName: null,
        rotation: 0,
        order: plates.length,
      },
    });
  };

  const toggleSound = () => {
    if (muted) {
      setMuted(false);
      if (open) {
        playFor(open);
      } else if (bgAudioRef.current) {
        bgAudioRef.current.volume = 0.75;
        bgAudioRef.current.play().catch(() => {});
      }
    } else {
      setMuted(true);
      setIsPlayingAudio(false);
      musicEngine.stop();
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    }
  };


  return (
    <main className="relative flex min-h-screen flex-col cosmos-bg select-none overflow-hidden">
      {/* Overlay de Inicio de Sesión con Contraseña (JOSEFINA) */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="pointer-events-none absolute inset-0 starfield opacity-90" aria-hidden />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-popover/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl neon-ring text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-primary/20 text-accent neon-ring shadow-lg mb-6">
              <Sparkles className="h-8 w-8  text-accent" />
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground sm:text-4xl drop-shadow-md">
              Hola ✨
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Ingresa la contraseña para acceder a la galaxia de recuerdos.
            </p>

            <form onSubmit={handleUnlock} className="mt-8 space-y-4">
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="Escribe la contraseña..."
                  className={`w-full rounded-2xl border bg-secondary/50 px-5 py-4 text-center text-base tracking-widest text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:neon-ring shadow-inner ${
                    passwordError ? "border-destructive animate-shake" : "border-border/80"
                  }`}
                />
              </div>

              {passwordError && (
                <p className="text-xs text-destructive animate-in fade-in duration-200">
                  Contraseña incorrecta... Pista: Tu segundo nombre 🌹
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent py-4 text-sm font-bold tracking-wider text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Entrar a la Galaxia ✨
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Audio de Fondo: Interstellar Piano Solo (TikTok Slow Version) */}
      <audio
        ref={bgAudioRef}
        src={interstellarAudioUrl}
        loop
        playsInline
        preload="auto"
      />

      {/* Fondo de estrellas animadas */}
      <div className="pointer-events-none absolute inset-0 starfield opacity-80" aria-hidden />

      {/* Barra superior */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-popover/80 backdrop-blur-md neon-ring">
            <Sparkles className="h-5 w-5 text-primary " />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-neon sm:text-xl">Galaxia de Recuerdos</h1>
            <p className="text-[0.7rem] text-muted-foreground">{plates.length} recuerdos en órbita constante</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón de Música / Volumen */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Activar música" : "Silenciar música"}
            className="shrink-0 rounded-full border border-border bg-popover/70 p-2.5 text-foreground backdrop-blur-xl transition-all hover:neon-ring hover:scale-105 active:scale-95 cursor-pointer sm:p-3"
          >
            {muted ? <VolumeX className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 text-accent  sm:h-5 sm:w-5" />}
          </button>
        </div>
      </header>

      {/* Sección principal del carrusel con movimiento y flotación */}
      <section className="relative z-10 flex flex-1 items-center justify-center overflow-hidden py-4">
        {/* Controles laterales */}
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          className="absolute left-4 z-20 hidden rounded-full border border-border bg-popover/80 p-3 text-foreground backdrop-blur-xl transition-all hover:neon-ring hover:scale-110 active:scale-90 md:block cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollBy(1)}
          className="absolute right-4 z-20 hidden rounded-full border border-border bg-popover/80 p-3 text-foreground backdrop-blur-xl transition-all hover:neon-ring hover:scale-110 active:scale-90 md:block cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Pista de deslizamiento infinito */}
        <div
          ref={track}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={() => {
            if (!isDragging.current) setIsUserInteracting(false);
          }}
          className="flex w-full items-center gap-7 overflow-x-auto px-8 py-20 sm:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
          style={{ willChange: "scroll-position" }}
        >
          {looped.map((plate, i) => {
            const floatClass = "";
            const initialOffset = i % 2 === 0 ? "1.5rem" : "-1.5rem";
            const mediaSrc = plateImageSrc(plate, urlCache.current);
            const isVid = isMediaVideo(plate, mediaSrc);
            const rot = plate.rotation ?? 0;

            return (
              <div
                key={`${plate.id}-${i}`}
                style={{
                  marginTop: initialOffset,
                  animationDelay: `${(i % 5) * 0.4}s`,
                }}
                className={`group relative w-[72vw] max-w-[22rem] shrink-0 overflow-hidden rounded-3xl border border-border/80 bg-[#16102a]/95 shadow-xl transition-transform duration-300 hover:scale-105 ${floatClass}`} style={{ willChange: "transform", contain: "layout paint" }}
              >
                {/* Botón para abrir recuerdo y reproducir música */}
                {/* Diseño especial de Girasol Cósmico para la casilla #31 */}
                {plate.id === "p31" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(plate.id);
                      playFor(plate);
                    }}
                    className="block w-full text-left cursor-pointer relative overflow-hidden bg-gradient-to-b from-[#241305]/95 via-[#1a0f26]/95 to-[#0b0817]/95 border-2 border-amber-400/60 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.6)] transition-all group/sunflower"
                  >
                    <div className="relative h-[24rem] sm:h-[28rem] flex flex-col items-center justify-between p-6 overflow-hidden">
                      {/* Resplandor ámbar */}
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/25 rounded-full blur-2xl group-hover/sunflower:scale-125 transition-transform duration-700 pointer-events-none" />

                      {/* Tag / Badge */}
                      <div className="z-10 self-start flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-950/80 px-3 py-1 text-[0.7rem] font-bold text-amber-300 backdrop-blur-md shadow-md">
                        <Sun className="h-3 w-3 text-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
                        {plate.tag}
                      </div>

                      {/* Girasol central animado en la tarjeta */}
                      <div className="relative z-10 my-auto flex flex-col items-center group-hover/sunflower:scale-110 transition-transform duration-500">
                        {/* Girasol SVG perfecto sin desfasaje */}
                        <svg width="130" height="130" viewBox="0 0 120 120" className="overflow-visible drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                          <g transform="translate(60, 60)">
                            {Array.from({ length: 18 }).map((_, pi) => {
                              const angle = (360 / 18) * pi;
                              return (
                                <g key={pi} transform={`rotate(${angle})`}>
                                  <ellipse cx="0" cy="-36" rx="7" ry="18" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
                                </g>
                              );
                            })}
                            <circle r="20" fill="#301503" stroke="#eab308" strokeWidth="1.5" />
                            <circle r="12" fill="#200d02" opacity="0.6" />
                          </g>
                        </svg>

                        <span className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                          🌻 Toca para abrir
                        </span>
                      </div>

                      {/* Contenido inferior */}
                      <div className="z-10 w-full text-center">
                        <h2 className="font-display text-lg font-bold text-amber-200 drop-shadow group-hover/sunflower:text-amber-100 transition-colors">
                          {plate.title}
                        </h2>
                        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-amber-300">
                          <Music className="h-3.5 w-3.5 animate-bounce" />
                          <span className="truncate font-semibold">{plate.audioName}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(plate.id);
                    playFor(plate);
                  }}
                  className="block w-full text-left cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-background/40">
                    {mediaSrc ? (
                      isVid ? (
                        <video
                          src={mediaSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{ transform: rot ? `rotate(${rot}deg)` : undefined }}
                          className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[28rem]"
                        />
                      ) : (
                        <img
                          src={mediaSrc}
                          alt={plate.title}
                          loading={i < 4 ? "eager" : "lazy"}
                          style={{ transform: rot ? `rotate(${rot}deg)` : undefined }}
                          className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[28rem]"
                        />
                      )
                    ) : (
                      <div className="flex h-[24rem] w-full items-center justify-center bg-secondary/30 text-sm text-muted-foreground sm:h-[28rem]">
                        Sin recurso añadido
                      </div>
                    )}
                    
                    {/* Gradiente de fondo oscuro para textos */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--background) 95%, transparent) 0%, color-mix(in oklab, var(--background) 60%, transparent) 35%, transparent 70%)",
                      }}
                    />

                    {/* Tag / Badge flotante */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-border/60 bg-popover/80 px-3 py-1 text-[0.7rem] font-semibold text-accent backdrop-blur-md shadow-md">
                      {isVid ? <Film className="h-3 w-3 text-primary " /> : <Sparkles className="h-3 w-3 text-primary" />}
                      {plate.tag}
                    </div>

                    {/* Contenido inferior */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h2 className="font-display text-xl font-bold text-foreground drop-shadow-md group-hover:text-neon transition-colors">
                        {plate.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-xs text-foreground/85 drop-shadow">
                        {plate.message}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                        <Music className="h-3.5 w-3.5 animate-bounce" />
                        <span className="truncate font-semibold">{plate.audioName}</span>
                      </div>
                    </div>
                  </div>
                </button>
                )}
                
              </div>
            );
          })}
        </div>
      </section>

      {/* Indicador de ayuda */}
      <footer className="relative z-10 pb-5 text-center">
        <p className="text-xs text-muted-foreground/80 flex items-center justify-center gap-2">
          <span>✨</span> Desliza o arrastra para explorar • Toca una foto o video para abrirlo <span>✨</span>
        </p>
      </footer>

      {/* Modal interactivo al abrir un recuerdo */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {open.id === "p31" ? (
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
              <SunflowerInteractive onClose={close} />
            </div>
          ) : (
          <>
          {/* Botón cerrar */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="absolute top-5 right-5 z-50 rounded-full border border-border bg-popover/80 p-3 text-foreground backdrop-blur-lg hover:bg-secondary hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>

          <figure
            className="relative flex flex-col items-center max-h-[92vh] max-w-2xl w-full rounded-3xl border border-border/80 bg-popover/90 p-6 sm:p-8 neon-ring backdrop-blur-3xl overflow-y-auto animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen o Video ampliado */}
            {plateImageSrc(open, urlCache.current) && (
              <div className="relative group w-full overflow-hidden rounded-2xl border border-border shadow-2xl bg-black/40">
                {isMediaVideo(open, plateImageSrc(open, urlCache.current)) ? (
                  <video
                    src={plateImageSrc(open, urlCache.current)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ transform: open.rotation ? `rotate(${open.rotation}deg)` : undefined }}
                    className="mx-auto max-h-[50vh] w-full object-contain rounded-2xl pointer-events-none"
                  />
                ) : (
                  <img
                    src={plateImageSrc(open, urlCache.current)}
                    alt={open.title}
                    style={{ transform: open.rotation ? `rotate(${open.rotation}deg)` : undefined }}
                    className="mx-auto max-h-[50vh] w-full object-contain rounded-2xl"
                  />
                )}
              </div>
            )}

            <figcaption className="mt-6 text-center w-full">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs text-accent">
                {isMediaVideo(open, plateImageSrc(open, urlCache.current)) ? (
                  <Film className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                )}
                {open.tag}
              </span>

              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-neon">
                {open.title}
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-foreground/90 italic font-sans bg-secondary/30 p-4 rounded-2xl border border-border/50">
                “{open.message}”
              </p>

              {/* Reproductor / Visualizador de música */}
              <div className="mt-6 flex items-center justify-center gap-4 rounded-2xl border border-border/80 bg-secondary/40 px-5 py-3.5 shadow-inner">
                {/* Ecualizador animado */}
                <div className="flex items-end gap-1 h-6 px-1">
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio && !muted ? "animate-sound-bar-1" : "h-2"}`} />
                  <span className={`w-1 bg-accent rounded-full ${isPlayingAudio && !muted ? "animate-sound-bar-2" : "h-3"}`} />
                  <span className={`w-1 bg-stardust rounded-full ${isPlayingAudio && !muted ? "animate-sound-bar-3" : "h-1"}`} />
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio && !muted ? "animate-sound-bar-4" : "h-3"}`} />
                </div>

                <div className="text-left flex-1 min-w-0">
                  <p className="font-display text-[0.65rem] tracking-[0.2em] text-accent uppercase font-bold">
                    Canción Asignada
                  </p>
                  <p className="text-sm font-bold text-foreground truncate max-w-[280px]" title={open.audioName ?? ""}>
                    {open.audioName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isPlayingAudio && !muted) {
                      musicEngine.stop();
                      setIsPlayingAudio(false);
                    } else {
                      setMuted(false);
                      playFor(open);
                    }
                  }}
                  className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-primary/20 px-3.5 py-1.5 text-xs text-primary-foreground font-medium hover:bg-primary/30 transition-all cursor-pointer"
                >
                  {isPlayingAudio && !muted ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-accent" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-primary fill-primary" /> Reproducir
                    </>
                  )}
                </button>
              </div>

              
            </figcaption>
          </figure>
          </>
          )}
        </div>
      )}

      {/* Editor de recuerdo */}
      {editing && (
        <PlateEditor
          plate={editing.plate}
          isNew={editing.isNew}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => {
            musicEngine.stop();
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}
