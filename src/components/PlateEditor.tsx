import { useEffect, useRef, useState } from "react";
import { Camera, Film, Image as ImageIcon, Music, RefreshCw, RotateCw, Trash2, Upload, X } from "lucide-react";
import { MELODIES } from "@/lib/melodies";
import { isMediaVideo, type Plate } from "@/lib/album";
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
  const mediaInput = useRef<HTMLInputElement>(null);
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

  const isVid = isMediaVideo(draft, preview);
  const rotation = draft.rotation ?? 0;

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

        {/* Contenedor de la Imagen/Video */}
        <div className="mt-5 space-y-2.5">
          <div
            onClick={() => mediaInput.current?.click()}
            className="group relative block h-64 w-full overflow-hidden rounded-2xl border-2 border-dashed border-border/80 bg-secondary/40 cursor-pointer shadow-inner transition-all hover:border-primary"
          >
            {preview ? (
              isVid ? (
                <video
                  src={preview}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
                  className="h-full w-full object-contain transition-transform duration-300"
                />
              ) : (
                <img
                  src={preview}
                  alt=""
                  style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
                  className="h-full w-full object-contain transition-transform duration-300"
                />
              )
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 text-primary/70" />
                <span className="text-xs">Sin archivo seleccionado</span>
              </div>
            )}

            {/* Badge permanente en la esquina para móviles */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-border/80 bg-popover/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md shadow-md">
              <Camera className="h-3.5 w-3.5 text-accent" />
              <span>Cambiar</span>
            </div>
          </div>

          {/* Botones de acción de medios: Subir y Rotar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => mediaInput.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/60 transition-all cursor-pointer shadow-sm"
            >
              <Upload className="h-4 w-4 text-accent" />
              <span>Subir foto o video</span>
            </button>
            <button
              type="button"
              onClick={() => setDraft(d => ({ ...d, rotation: ((d.rotation ?? 0) + 90) % 360 }))}
              title="Rotar imagen/video 90 grados"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/60 transition-all cursor-pointer shadow-sm"
            >
              <RotateCw className="h-4 w-4 text-primary" />
              <span>Rotar {rotation > 0 ? `(${rotation}°)` : ''}</span>
            </button>
          </div>

          <input
            ref={mediaInput}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setDraft((d) => ({
                  ...d,
                  imageBlob: file,
                  imageUrl: null,
                  isVideo: file.type.startsWith('video/'),
                }));
              }
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

        {/* Música del Recuerdo */}
        <div className="mt-6 space-y-2">
          <label className="block text-[0.7rem] font-display uppercase tracking-wider text-muted-foreground">
            Música del Recuerdo
          </label>

          {draft.audioName ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-3.5 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Music className="h-4 w-4 animate-bounce" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold tracking-wider text-accent">
                    Canción de la Carpeta
                  </p>
                  <p className="text-xs font-bold text-foreground truncate" title={draft.audioName}>
                    {draft.audioName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => audioInput.current?.click()}
                className="shrink-0 rounded-xl border border-border bg-popover/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => audioInput.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 bg-secondary/40 px-4 py-3 text-sm text-foreground hover:bg-secondary hover:border-primary/60 transition-all cursor-pointer shadow-sm"
            >
              <Music className="h-4 w-4 text-accent" />
              <span>Seleccionar canción de tu carpeta (mp3)</span>
            </button>
          )}

          <input
            ref={audioInput}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const cleanName = file.name.replace(/\.mp3$/i, '');
                setDraft((d) => ({ ...d, audioBlob: file, audioName: cleanName }));
              }
            }}
          />
        </div>

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
