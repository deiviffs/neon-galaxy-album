import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Volume2, VolumeX, X } from "lucide-react";
import { PlateEditor } from "@/components/PlateEditor";
import { deletePlate, loadPlates, plateImageSrc, savePlate, type Plate } from "@/lib/album";
import { getMelody } from "@/lib/melodies";
import { musicEngine } from "@/lib/musicEngine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Álbum Galaxia Neón — Imágenes, mensajes y música" },
      {
        name: "description",
        content:
          "Álbum cósmico editable: cada imagen guarda su mensaje romántico y su propia música. Cambia fotos, textos y canciones cuando quieras.",
      },
      { property: "og:title", content: "Álbum Galaxia Neón" },
      {
        property: "og:description",
        content: "Cada imagen con su mensaje y su música. Editable a tu gusto.",
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
  const [paused, setPaused] = useState(false);
  const urlCache = useRef(new Map<string, string>());
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadPlates().then(setPlates);
    return () => musicEngine.stop();
  }, []);

  const open = useMemo(() => plates.find((p) => p.id === openId) ?? null, [plates, openId]);

  const playFor = useCallback(
    (plate: Plate) => {
      if (muted) return;
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
    musicEngine.stop();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const scrollBy = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    setPaused(true);
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
    window.setTimeout(() => setPaused(false), 2500);
  };

  // Deriva automática infinita hacia la izquierda (bucle sin fin)
  const looped = useMemo(() => (plates.length >= 2 ? [...plates, ...plates] : plates), [plates]);

  useEffect(() => {
    if (open || editing || plates.length < 2) return;
    let raf = 0;
    const step = () => {
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft += half;
        if (!paused) el.scrollLeft += 0.45;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, open, editing, plates.length]);

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
        tag: `${String(plates.length + 1).padStart(2, "0")} · Estrella`,
        message: "Eres mi lugar favorito del universo 💖🧸✨",
        imageUrl: null,
        imageBlob: null,
        melody: "cristal",
        audioBlob: null,
        audioName: null,
        order: plates.length,
      },
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col cosmos-bg">
      <div className="pointer-events-none absolute inset-0 starfield opacity-70" aria-hidden />

      <header className="relative z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={addNew}
          className="flex w-fit items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          style={{ backgroundImage: "var(--gradient-neon)" }}
        >
          <Plus className="h-4 w-4" /> Añadir imagen
        </button>
        <button
          type="button"
          onClick={() => {
            setMuted((m) => !m);
            musicEngine.stop();
          }}
          aria-label={muted ? "Activar música" : "Silenciar música"}
          className="shrink-0 rounded-full border border-border bg-popover/70 p-3 text-foreground backdrop-blur-xl hover:neon-ring"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-accent" />}
        </button>
      </header>

      <h1 className="sr-only">Álbum Galaxia de Neón</h1>

      <section className="relative z-10 flex flex-1 items-center">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          className="absolute left-2 z-20 hidden rounded-full border border-border bg-popover/70 p-3 text-foreground backdrop-blur hover:neon-ring sm:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollBy(1)}
          className="absolute right-2 z-20 hidden rounded-full border border-border bg-popover/70 p-3 text-foreground backdrop-blur hover:neon-ring sm:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={track}
          onPointerDown={() => setPaused(true)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex w-full items-center gap-6 overflow-x-auto px-6 py-16 sm:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {looped.map((plate, i) => (
            <article
              key={`${plate.id}-${i}`}
              style={{ transform: `translateY(${i % 2 === 0 ? "2.5rem" : "-2.5rem"})` }}
              className="group relative w-[70vw] max-w-sm shrink-0 overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:neon-ring"
            >
              <button
                type="button"
                onClick={() => {
                  setOpenId(plate.id);
                  playFor(plate);
                }}
                className="block w-full text-left"
              >
                {plateImageSrc(plate, urlCache.current) ? (
                  <img
                    src={plateImageSrc(plate, urlCache.current)}
                    alt={plate.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[30rem]"
                  />
                ) : (
                  <div className="flex h-[24rem] w-full items-center justify-center text-sm text-muted-foreground sm:h-[30rem]">
                    Añade una imagen
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, transparent) 6%, transparent 60%)",
                  }}
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <h2 className="font-display text-xl font-bold text-foreground">{plate.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-foreground/80">{plate.message}</p>
                  <p className="mt-2 text-xs text-accent">
                    ♪ {plate.audioName ?? getMelody(plate.melody).name}
                  </p>
                </div>
              </button>
              <button
                type="button"
                aria-label={`Editar ${plate.title}`}
                onClick={() => setEditing({ plate, isNew: false })}
                className="absolute top-4 right-4 rounded-full border border-border bg-popover/70 p-2.5 text-foreground backdrop-blur transition-colors hover:bg-primary/30"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </article>
          ))}

          {plates.length < 2 && (
          <button
            type="button"
            onClick={addNew}
            style={{ transform: `translateY(${plates.length % 2 === 0 ? "2.5rem" : "-2.5rem"})` }}
            className="flex h-[24rem] w-[60vw] max-w-xs shrink-0 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground sm:h-[30rem]"
          >
            <Plus className="h-8 w-8 text-primary" />
            <span className="font-display text-xs tracking-[0.3em] uppercase">Anexar imagen</span>
          </button>
        </div>
      </section>

      <p className="relative z-10 pb-6 text-center text-xs text-muted-foreground">
        Desliza para ver más 💖🧸✨
      </p>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 p-6 backdrop-blur-xl"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="absolute top-6 right-6 rounded-full border border-border bg-card/70 p-3 text-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-h-full max-w-3xl text-center" onClick={(e) => e.stopPropagation()}>
            {plateImageSrc(open, urlCache.current) && (
              <img
                src={plateImageSrc(open, urlCache.current)}
                alt={open.title}
                className="mx-auto max-h-[60vh] w-auto rounded-3xl border border-border object-contain neon-ring"
              />
            )}
            <figcaption className="mt-6">
              <h2 className="font-display text-2xl font-bold text-neon">{open.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-foreground/85 italic">
                “{open.message}”
              </p>
              <p className="mt-4 font-display text-[0.65rem] tracking-[0.3em] text-accent uppercase">
                ♪ {open.audioName ?? getMelody(open.melody).name}
              </p>
            </figcaption>
          </figure>
        </div>
      )}

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
