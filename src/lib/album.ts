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
    title: "La Casualidad Mágica",
    tag: "01 • El Inicio",
    message:
      "Recuerdo perfectamente cómo empezamos; aquella confusión por Messenger, por pura casualidad, fue lo que hizo que nos encontráramos y empezáramos a construir esta historia tan bonita ✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 0,
  },
  {
    id: "p2",
    title: "La Magia del Comienzo",
    tag: "02 • Primer Destello",
    message:
      "Te conocí cuando ni siquiera estaba buscando amor... Al principio todo fue mágico: valía la pena arriesgar el aliento, los suspiros y las sonrisas por algo tan hermoso 💫",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 1,
  },
  {
    id: "p3",
    title: "Nuestras Risas y Complicidad",
    tag: "03 • Complicidad",
    message:
      "Recuerdo cómo compartíamos tiempo, las risas, las bromas, las veces que ibas a mi casa... Poco a poco tú me hiciste cambiar de parecer y empecé a amarte con todo el corazón 🌹",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 2,
  },
  {
    id: "p4",
    title: "Creer en lo Imposible",
    tag: "04 • Ilusión",
    message:
      "Una vez me preguntaste si te quería... Y siempre sigo aquí, porque contigo elegí creer en lo imposible y en la magia de quererte de verdad 💖",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 3,
  },
  {
    id: "p5",
    title: "Crear Nuestro Destino",
    tag: "05 • Constelación",
    message:
      "No soy de los que deja las cosas al azar. Yo prefiero trabajar en ese destino a tu lado y mejorarlo, porque el destino se crea con lo que uno hace con el corazón 🪐✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 4,
  },
  {
    id: "p6",
    title: "Una Huella Imborrable",
    tag: "06 • Luz Estelar",
    message:
      "Llegaste a mi vida cuando menos lo esperaba y te convertiste en una de las personas más importantes para mí. Me hiciste volver a creer en algo bonito ✨💖",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 5,
  },
  {
    id: "p7",
    title: "Soñar a Tu Lado",
    tag: "07 • Infinito",
    message:
      "Durante un tiempo imaginé un futuro a tu lado y fui inmensamente feliz haciéndolo. Gracias por cada momento, por cada conversación y por la tranquilidad que me diste 🌌",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 6,
  },
  {
    id: "p8",
    title: "Tus Ocurrencias y Detalles",
    tag: "08 • Especial",
    message:
      "Tu forma de ser, nuestras charlas, tus ocurrencias y cada pequeño detalle que te hacía especial... todo eso tiene un lugar eterno e imborrable en mi corazón 🧸✨",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 7,
  },
  {
    id: "p9",
    title: "Sentimiento Incondicional",
    tag: "09 • Promesa",
    message:
      "Es mentira que voy a dejar de quererte; estaré allí para ti siempre, siempre que me necesites, hasta el día en que ya no me necesites. La historia aún sigue ✨💖",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 8,
  },
  {
    id: "p10",
    title: "Para: Nathalia Josefina 🧸✨",
    tag: "10 • Deivis",
    message:
      "De todo corazón deseo que te vaya increíble en todo, que cumplas cada una de tus metas y que siempre tengas motivos para sonreír. ¡Pásala súper, peque! — Att: Deivis 💖",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 9,
  },
];

const DB_NAME = "album-galaxia-v4";
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

export async function resetToDefaultPlates(): Promise<Plate[]> {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.clear();
    await Promise.all(DEFAULT_PLATES.map((p) => store.put(p)));
  } catch (e) {
    console.error("Error resetting plates", e);
  }
  return [...DEFAULT_PLATES];
}

export async function loadPlates(): Promise<Plate[]> {
  try {
    try {
      indexedDB.deleteDatabase("album-galaxia");
      indexedDB.deleteDatabase("album-galaxia-v2");
      indexedDB.deleteDatabase("album-galaxia-v3");
    } catch {}

    const db = await openDb();
    const rows = await new Promise<Plate[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as Plate[]);
      req.onerror = () => reject(req.error);
    });

    if (!rows.length || rows.length < 10) {
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
