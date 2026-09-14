import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Sparkles, Volume2, VolumeX, X } from "lucide-react";
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
  const urlCache = useRef(new Map<string, string>());

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
        message: "Escribe aquí algo bonito...",
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
    <main className="relative min-h-screen cosmos-bg">
      <div className="pointer-events-none absolute inset-0 starfield opacity-70" aria-hidden />

      <button
        type="button"
        onClick={() => {
          setMuted((m) => !m);
          musicEngine.stop();
        }}
        aria-label={muted ? "Activar música" : "Silenciar música"}
        className="fixed top-5 right-5 z-50 rounded-full border border-border bg-popover/70 p-3 text-foreground backdrop-blur-xl hover:neon-ring"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-accent" />}
      </button>

      <section className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl pulse-glow"
          style={{ backgroundImage: "var(--gradient-neon)", opacity: 0.22 }}
          aria-hidden
        />
        <p className="font-display text-xs tracking-[0.5em] text-accent uppercase">Álbum cósmico</p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-black tracking-tight sm:text-7xl">
          <span className="text-neon">Galaxia</span>
          <br />
          <span className="text-foreground/90">de Neón</span>
        </h1>
        <p className="mt-7 max-w-xl text-base text-muted-foreground sm:text-lg">
          Toca una imagen y sonará su propia música mientras aparece su mensaje. Todo se puede cambiar:
          las fotos, los textos y las canciones.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={addNew}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            <Plus className="h-4 w-4" /> Añadir imagen
          </button>
          <span className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-3 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" /> Usa el lápiz para editar
          </span>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-8 sm:grid-cols-2">
          {plates.map((plate, i) => (
            <div
              key={plate.id}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:neon-ring ${
                i % 2 === 1 ? "sm:translate-y-10" : ""
              }`}
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
                    className="h-[26rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[32rem]"
                  />
                ) : (
                  <div className="flex h-[26rem] w-full items-center justify-center text-sm text-muted-foreground sm:h-[32rem]">
                    Añade una imagen
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, transparent) 6%, transparent 65%)",
                  }}
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="font-display text-[0.65rem] tracking-[0.35em] text-accent uppercase">
                    {plate.tag}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-foreground">{plate.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
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
            </div>
          ))}

          <button
            type="button"
            onClick={addNew}
            className={`flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground ${
              plates.length % 2 === 1 ? "sm:translate-y-10" : ""
            }`}
          >
            <Plus className="h-8 w-8 text-primary" />
            <span className="font-display text-xs tracking-[0.3em] uppercase">Anexar imagen</span>
          </button>
        </div>

        <p className="mt-24 text-center font-display text-xs tracking-[0.4em] text-muted-foreground uppercase">
          Hecho con polvo de estrellas
        </p>
      </section>

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
