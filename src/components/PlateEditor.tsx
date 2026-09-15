import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, Music, RefreshCw, Trash2, Upload, X } from "lucide-react";
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
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-background/90 p-4 backdrop-blur-xl sm:p-8">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-popover p-6 neon-ring shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-neon">
            {isNew ? "Nuevo recuerdo" : "Editar recuerdo"}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenedor de la Imagen con Badge siempre visible */}
        <div className="mt-5 space-y-2.5">
          <div
            onClick={() => imgInput.current?.click()}
            className="group relative block h-56 w-full overflow-hidden rounded-2xl border-2 border-dashed border-border/80 bg-secondary/40 cursor-pointer shadow-inner transition-all hover:border-primary"
          >
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 text-primary/70" />
                <span className="text-xs">Sin imagen seleccionada</span>
              </div>
            )}

            {/* Overlay interactivo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 backdrop-blur-xs opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg">
                <Camera className="h-4 w-4" /> Seleccionar otra foto
              </span>
            </div>

            {/* Badge permanente en la esquina de la imagen para móviles */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-border/80 bg-popover/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md shadow-md">
              <Camera className="h-3.5 w-3.5 text-accent" />
              <span>Cambiar</span>
            </div>
          </div>

          {/* Botón directo visible debajo de la imagen */}
          <button
            type="button"
            onClick={() => imgInput.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/60 transition-all cursor-pointer shadow-sm"
          >
            <Upload className="h-4 w-4 text-accent" />
            <span>Subir o cambiar imagen desde tu dispositivo</span>
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
        </div>

        {/* Campos de texto */}
        <div className="mt-5 space-y-3">
          <div>
            <label className="block mb-1 text-[0.7rem] font-display uppercase tracking-wider text-muted-foreground">Título</label>
            <input
              className={field}
              placeholder="Título del recuerdo"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-1 text-[0.7rem] font-display uppercase tracking-wider text-muted-foreground">Etiqueta</label>
            <input
              className={field}
              placeholder="Etiqueta (ej. 01 • El Inicio)"
              value={draft.tag}
              onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-1 text-[0.7rem] font-display uppercase tracking-wider text-muted-foreground">Mensaje o Dedicatoria</label>
            <textarea
              className={`${field} min-h-24 resize-none`}
              placeholder="Escribe el mensaje..."
              value={draft.message}
              onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
            />
          </div>
        </div>

        {/* Selección de música */}
        <p className="mt-6 font-display text-[0.65rem] tracking-[0.3em] text-accent uppercase">Música Cósmica</p>
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
                className={`rounded-full border px-4 py-2 text-xs transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary/25 text-foreground neon-ring font-semibold"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Subida de canción personalizada */}
        <button
          type="button"
          onClick={() => audioInput.current?.click()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground hover:bg-secondary hover:border-primary/60 transition-all cursor-pointer shadow-sm"
        >
          <Music className="h-4 w-4 text-accent" />
          {draft.audioName ? `Canción: ${draft.audioName}` : "Subir tu propia canción (mp3 / audio)"}
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
            className="mt-2 text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
          >
            Quitar canción y volver a melodía ambiental
          </button>
        )}

        {/* Botones de acción inferior */}
        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              musicEngine.stop();
              onSave(draft);
            }}
            className="flex-1 rounded-full px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            Guardar cambios
          </button>
          {!isNew && (
            <button
              type="button"
              aria-label="Eliminar recuerdo"
              onClick={() => {
                if (window.confirm("¿Estás seguro de eliminar este recuerdo?")) {
                  musicEngine.stop();
                  onDelete(draft.id);
                }
              }}
              className="rounded-full border border-border p-3 text-destructive hover:bg-destructive/15 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
