import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import cosmos1 from "@/assets/cosmos-1.jpg";
import cosmos2 from "@/assets/cosmos-2.jpg";
import cosmos3 from "@/assets/cosmos-3.jpg";
import cosmos4 from "@/assets/cosmos-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Álbum Galaxia Neón — Imágenes y música cósmica" },
      {
        name: "description",
        content:
          "Un álbum visual de galaxias neón con música ambiental generada en vivo. Recorre nebulosas, planetas y horizontes de luz.",
      },
      { property: "og:title", content: "Álbum Galaxia Neón" },
      {
        property: "og:description",
        content: "Galerías de nebulosas y planetas neón con banda sonora ambiental.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const plates = [
  {
    src: cosmos1,
    title: "Corazón de Nebulosa",
    caption: "Donde el rosa y el cian colisionan y nacen estrellas nuevas.",
    tag: "01 · Nebulosa",
  },
  {
    src: cosmos2,
    title: "Deriva Violeta",
    caption: "Un viajero suspendido frente a un planeta que respira luz.",
    tag: "02 · Órbita",
  },
  {
    src: cosmos3,
    title: "Espiral Infinita",
    caption: "El remolino que guarda mil millones de soles en su centro.",
    tag: "03 · Espiral",
  },
  {
    src: cosmos4,
    title: "Horizonte de Neón",
    caption: "Lagos de cristal, lunas gemelas y una rejilla que nunca termina.",
    tag: "04 · Horizonte",
  },
];

function Index() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative min-h-screen cosmos-bg">
      <div className="pointer-events-none absolute inset-0 starfield opacity-70" aria-hidden />

      <section className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
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
          Cuatro postales de un universo imaginado, con una banda sonora que se compone sola mientras
          las miras. Enciende el sonido y desliza.
        </p>
        <div className="mt-10 flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-2 text-sm text-muted-foreground backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          Toca cualquier imagen para verla en grande
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-40">
        <div className="grid gap-8 sm:grid-cols-2">
          {plates.map((plate, i) => (
            <button
              key={plate.title}
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card text-left transition-all duration-500 hover:-translate-y-2 hover:neon-ring ${
                i % 2 === 1 ? "sm:translate-y-10" : ""
              }`}
            >
              <img
                src={plate.src}
                alt={plate.title}
                loading={i === 0 ? "eager" : "lazy"}
                width={1280}
                height={1600}
                className="h-[26rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[32rem]"
              />
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
                <p className="mt-1 text-sm text-muted-foreground">{plate.caption}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-24 text-center font-display text-xs tracking-[0.4em] text-muted-foreground uppercase">
          Hecho con polvo de estrellas
        </p>
      </section>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-xl"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 rounded-full border border-border bg-card/70 p-3 text-foreground transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-h-full max-w-3xl text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={plates[open]!.src}
              alt={plates[open]!.title}
              width={1280}
              height={1600}
              className="mx-auto max-h-[74vh] w-auto rounded-3xl border border-border object-contain neon-ring"
            />
            <figcaption className="mt-5">
              <h2 className="font-display text-xl font-bold text-neon">{plates[open]!.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plates[open]!.caption}</p>
            </figcaption>
          </figure>
        </div>
      )}

      <AmbientPlayer />
    </main>
  );
}
