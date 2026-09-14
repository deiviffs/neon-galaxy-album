import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Music, Trash2, X } from "lucide-react";
import { MELODIES } from "@/lib/melodies";
import type { Plate } from "@/lib/album";
import { musicEngine } from "@/lib/musicEngine";

type Props = {
  plate: Plate;
  isNew: boolean;
  onSave: (plate: Plate) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function PlateEditor({ plate, isNew, onSave, onDelete, onClose }: Props) {
  const [draft, setDraft] = useState<Plate>(plate);
  const [preview, setPreview] = useState<string>("");
  const imgInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draft.imageBlob) {
      const url = URL.createObjectURL(draft.imageBlob);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(draft.imageUrl ?? "");
    return;
  }, [draft.imageBlob, draft.imageUrl]);

  const field =
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-background/90 p-4 backdrop-blur-xl sm:p-8">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-popover p-6 neon-ring">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-neon">
            {isNew ? "Nueva imagen" : "Editar recuerdo"}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => imgInput.current?.click()}
          className="group relative mt-5 block h-52 w-full overflow-hidden rounded-2xl border border-border bg-secondary/40"
        >
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sin imagen
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
            <ImageIcon className="h-4 w-4 text-accent" /> Cambiar imagen
          </span>
        </button>
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setDraft((d) => ({ ...d, imageBlob: file, imageUrl: null }));
          }}
        />

        <div className="mt-5 space-y-3">
          <input
            className={field}
            placeholder="Título"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <input
            className={field}
            placeholder="Etiqueta (ej. 05 · Estrella)"
            value={draft.tag}
            onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))}
          />
          <textarea
            className={`${field} min-h-28 resize-none`}
            placeholder="Mensaje romántico..."
            value={draft.message}
            onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
          />
        </div>

        <p className="mt-6 font-display text-[0.65rem] tracking-[0.3em] text-accent uppercase">Música</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MELODIES.map((m) => {
            const active = !draft.audioBlob && draft.melody === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setDraft((d) => ({ ...d, melody: m.key, audioBlob: null, audioName: null }));
                  void musicEngine.playMelody(m.key);
                }}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary/20 text-foreground neon-ring"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => audioInput.current?.click()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <Music className="h-4 w-4 text-accent" />
          {draft.audioName ? `Canción: ${draft.audioName}` : "Subir tu propia canción (mp3)"}
        </button>
        <input
          ref={audioInput}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setDraft((d) => ({ ...d, audioBlob: file, audioName: file.name }));
          }}
        />
        {draft.audioName && (
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, audioBlob: null, audioName: null }))}
            className="mt-2 text-xs text-muted-foreground underline"
          >
            Quitar canción y usar una melodía
          </button>
        )}

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              musicEngine.stop();
              onSave(draft);
            }}
            className="flex-1 rounded-full px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            Guardar
          </button>
          {!isNew && (
            <button
              type="button"
              aria-label="Eliminar"
              onClick={() => {
                musicEngine.stop();
                onDelete(draft.id);
              }}
              className="rounded-full border border-border p-3 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
