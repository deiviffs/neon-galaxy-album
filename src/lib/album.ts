import cosmos1 from "@/assets/cosmos-1.jpg";
import cosmos2 from "@/assets/cosmos-2.jpg";
import cosmos3 from "@/assets/cosmos-3.jpg";
import cosmos4 from "@/assets/cosmos-4.jpg";

export type Plate = {
  id: string;
  title: string;
  tag: string;
  message: string;
  /** URL de la imagen incluida por defecto (si no hay archivo subido) */
  imageUrl: string | null;
  imageBlob: Blob | null;
  /** Melodía generada */
  melody: string;
  /** Audio subido por la usuaria (tiene prioridad sobre la melodía) */
  audioBlob: Blob | null;
  audioName: string | null;
  order: number;
};

export const DEFAULT_PLATES: Plate[] = [
  {
    id: "p1",
    title: "Corazón de Nebulosa",
    tag: "01 · Nebulosa",
    message:
      "Si el universo late, late con tu ritmo 💖 Entre todo este rosa y este azul, sigues siendo lo más bonito que he visto ✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 0,
  },
  {
    id: "p2",
    title: "Deriva Violeta",
    tag: "02 · Órbita",
    message:
      "Floto sin gravedad cada vez que me miras 🧸 No necesito planeta: contigo cualquier lugar es hogar 💖",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 1,
  },
  {
    id: "p3",
    title: "Espiral Infinita",
    tag: "03 · Espiral",
    message:
      "Mil millones de estrellas girando y ninguna se compara ✨ Te elegiría en cada vuelta de esta galaxia 💖",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 2,
  },
  {
    id: "p4",
    title: "Horizonte de Neón",
    tag: "04 · Horizonte",
    message:
      "Caminemos esta luz hasta donde no haya final 🧸 Yo llevo la música, tú llevas el brillo ✨💖",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 3,
  },
];

const DB_NAME = "album-galaxia";
const STORE = "plates";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadPlates(): Promise<Plate[]> {
  try {
    const db = await openDb();
    const rows = await new Promise<Plate[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as Plate[]);
      req.onerror = () => reject(req.error);
    });
    if (!rows.length) {
      await Promise.all(DEFAULT_PLATES.map(savePlate));
      return [...DEFAULT_PLATES];
    }
    return rows.sort((a, b) => a.order - b.order);
  } catch {
    return [...DEFAULT_PLATES];
  }
}

export async function savePlate(plate: Plate): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(plate);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePlate(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export const plateImageSrc = (plate: Plate, urlCache: Map<string, string>): string => {
  if (plate.imageBlob) {
    const cached = urlCache.get(`img-${plate.id}`);
    if (cached) return cached;
    const url = URL.createObjectURL(plate.imageBlob);
    urlCache.set(`img-${plate.id}`, url);
    return url;
  }
  return plate.imageUrl ?? "";
};
