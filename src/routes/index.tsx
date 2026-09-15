import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Music, Pencil, Play, Plus, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { PlateEditor } from "@/components/PlateEditor";
import { deletePlate, loadPlates, plateImageSrc, savePlate, type Plate } from "@/lib/album";
import { getMelody } from "@/lib/melodies";
import { musicEngine } from "@/lib/musicEngine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Álbum Galaxia Neón ✨ Imágenes, mensajes y música" },
      {
        name: "description",
        content:
          "Álbum cósmico editable: cada imagen guarda su mensaje romántico y su propia música. Flotación cósmica y desplazamiento interactivo.",
      },
      { property: "og:title", content: "Álbum Galaxia Neón" },
      {
        property: "og:description",
        content: "Cada imagen con su mensaje y su música. Flotando en el cosmos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ plate: Plate; isNew: boolean } | null>(null);
  const [muted, setMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const urlCache = useRef(new Map<string, string>());
  const track = useRef<HTMLDivElement>(null);

  // Arrastre con el mouse / touch
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    void loadPlates().then(setPlates);
    return () => musicEngine.stop();
  }, []);

  const open = useMemo(() => plates.find((p) => p.id === openId) ?? null, [plates, openId]);

  const playFor = useCallback(
    (plate: Plate) => {
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
  }, []);

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

  // Triplicar para bucle continuo fluido e infinito sin saltos
  const looped = useMemo(() => {
    if (!plates.length) return [];
    if (plates.length === 1) return [...plates, ...plates, ...plates, ...plates];
    if (plates.length < 4) return [...plates, ...plates, ...plates, ...plates];
    return [...plates, ...plates, ...plates];
  }, [plates]);

  // Movimiento constante y automático hacia la izquierda
  useEffect(() => {
    if (open || editing || looped.length < 2) return;
    let raf = 0;
    const speed = 0.85; // Velocidad de desplazamiento fluido continuo hacia la izquierda

    const step = () => {
      const el = track.current;
      if (el) {
        const singleSetWidth = el.scrollWidth / (looped.length / Math.max(1, plates.length));
        
        // Loop infinito suave
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += singleSetWidth;
        }

        if (!isUserInteracting && !isDragging.current) {
          el.scrollLeft += speed;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isUserInteracting, open, editing, looped.length, plates.length]);

  // Manejadores de arrastre con mouse o táctil
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
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      pauseInteraction(2000);
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
        order: plates.length,
      },
    });
  };

  const toggleSound = () => {
    if (muted) {
      setMuted(false);
      if (open) {
        playFor(open);
      }
    } else {
      setMuted(true);
      setIsPlayingAudio(false);
      musicEngine.stop();
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col cosmos-bg select-none overflow-hidden">
      {/* Fondo de estrellas animadas */}
      <div className="pointer-events-none absolute inset-0 starfield opacity-80" aria-hidden />

      {/* Barra superior */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-popover/80 backdrop-blur-md neon-ring">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-neon sm:text-xl">Álbum Cósmico</h1>
            <p className="text-[0.7rem] text-muted-foreground">Recuerdos en órbita constante</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addNew}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Añadir recuerdo</span><span className="sm:hidden">Añadir</span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Activar música" : "Silenciar música"}
            className="shrink-0 rounded-full border border-border bg-popover/70 p-3 text-foreground backdrop-blur-xl transition-all hover:neon-ring hover:scale-105 active:scale-95 cursor-pointer"
          >
            {muted ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-accent animate-pulse" />}
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
            const floatClass = i % 3 === 0 ? "float-card-1" : i % 3 === 1 ? "float-card-2" : "float-card-3";
            const initialOffset = i % 2 === 0 ? "1.5rem" : "-1.5rem";

            return (
              <div
                key={`${plate.id}-${i}`}
                style={{
                  marginTop: initialOffset,
                  animationDelay: `${(i % 5) * 0.4}s`,
                }}
                className={`group relative w-[75vw] max-w-sm shrink-0 overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:neon-ring ${floatClass}`}
              >
                {/* Botón para abrir recuerdo y reproducir música */}
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(plate.id);
                    playFor(plate);
                  }}
                  className="block w-full text-left cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    {plateImageSrc(plate, urlCache.current) ? (
                      <img
                        src={plateImageSrc(plate, urlCache.current)}
                        alt={plate.title}
                        loading={i < 3 ? "eager" : "lazy"}
                        className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[28rem]"
                      />
                    ) : (
                      <div className="flex h-[24rem] w-full items-center justify-center bg-secondary/30 text-sm text-muted-foreground sm:h-[28rem]">
                        Sin imagen añadida
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
                      <Sparkles className="h-3 w-3 text-primary" />
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
                        <span className="truncate">{plate.audioName ?? getMelody(plate.melody).name}</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Botón de edición */}
                <button
                  type="button"
                  aria-label={`Editar ${plate.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing({ plate, isNew: false });
                  }}
                  className="absolute top-4 right-4 z-20 rounded-full border border-border bg-popover/80 p-2.5 text-foreground backdrop-blur-md transition-all hover:bg-primary/40 hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Indicador de ayuda */}
      <footer className="relative z-10 pb-5 text-center">
        <p className="text-xs text-muted-foreground/80 flex items-center justify-center gap-2">
          <span>✨</span> Desliza o arrastra para explorar • Toca una foto para escucharla <span>✨</span>
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
            {/* Imagen ampliada */}
            {plateImageSrc(open, urlCache.current) && (
              <div className="relative group w-full overflow-hidden rounded-2xl border border-border shadow-2xl">
                <img
                  src={plateImageSrc(open, urlCache.current)}
                  alt={open.title}
                  className="mx-auto max-h-[50vh] w-full object-cover rounded-2xl"
                />
              </div>
            )}

            <figcaption className="mt-6 text-center w-full">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs text-accent">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {open.tag}
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

                <div className="text-left">
                  <p className="font-display text-[0.65rem] tracking-[0.2em] text-accent uppercase">
                    Sonido Cósmico
                  </p>
                  <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                    {open.audioName ?? getMelody(open.melody).name}
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

              {/* Botón de editar este recuerdo desde el modal */}
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentOpen = open;
                    close();
                    setEditing({ plate: currentOpen, isNew: false });
                  }}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar este recuerdo
                </button>
              </div>
            </figcaption>
          </figure>
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
