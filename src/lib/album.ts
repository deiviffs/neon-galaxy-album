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

const cosmosImages = [cosmos1, cosmos2, cosmos3, cosmos4];
const melodies = ["orbita", "venus", "latido", "deriva", "cristal", "nocturno"];

export const DEFAULT_PLATES: Plate[] = [
  {
    id: "p1",
    title: "La Casualidad de Messenger",
    tag: "01 • El Comienzo",
    message: "Recuerdo perfectamente cómo empezamos: aquella confusión tuya por Messenger, por pura casualidad, fue el inicio de algo maravilloso ✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 0,
  },
  {
    id: "p2",
    title: "El Primer Destello",
    tag: "02 • Chispa",
    message: "Al principio yo no buscaba nada, pero tu forma de ser, tus risas y tus charlas me hicieron cambiar de parecer por completo 💫",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 1,
  },
  {
    id: "p3",
    title: "Nuestras Bromas en Casa",
    tag: "03 • Risas",
    message: "Aquellas tardes compartiendo tiempo, las risas interminables y las bromas que solo nosotros entendíamos 🌹",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 2,
  },
  {
    id: "p4",
    title: "Dejar de Verla como Amiga",
    tag: "04 • Sentimiento",
    message: "Llegó un momento en el que ya no te miraba solo como una amiga: empecé a quererte y a sentir algo verdaderamente único en el corazón 💖",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 3,
  },
  {
    id: "p5",
    title: "Creer en lo Imposible",
    tag: "05 • Ilusión",
    message: "Una vez me preguntaste si te quería... Y siempre sigo aquí, porque contigo elegí creer en lo imposible y en la magia de quererte ✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 4,
  },
  {
    id: "p6",
    title: "Forjar Nuestro Destino",
    tag: "06 • Constelación",
    message: "No creo en sentarme a esperar el destino; prefiero construirlo a tu lado con hechos, paciencia y cariño sincero 🪐",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 5,
  },
  {
    id: "p7",
    title: "Demostrar con Hechos",
    tag: "07 • Sinceridad",
    message: "Elegí estar a tu lado demostrándote que lo mío era en serio, honesto y nacido desde lo más puro del corazón 💫",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 6,
  },
  {
    id: "p8",
    title: "Querer Sin Fecha de Caducidad",
    tag: "08 • Eterno",
    message: "Es mentira que voy a dejar de quererte: eso no se borra ni hoy, ni mañana, ni con el paso del tiempo 🌌",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 7,
  },
  {
    id: "p9",
    title: "La Música de Nuestra Historia",
    tag: "09 • Melodía",
    message: "Cada acorde me recuerda a ti y a nuestras anécdotas compartidas en esta sincronía cósmica tan bonita 🎵✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 8,
  },
  {
    id: "p10",
    title: "Tú de 19 y Yo de 23",
    tag: "10 • Casualidad",
    message: "Esa coincidencia de momentos y ocurrencias que nos hizo reír tantas veces: casualidades que se vuelven magia 💫",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 9,
  },
  {
    id: "p11",
    title: "Apoyarte Siempre",
    tag: "11 • Incondicional",
    message: "Estaré allí para ti siempre que me necesites, para escucharte, cuidarte y celebrar cada uno de tus logros 🌹",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 10,
  },
  {
    id: "p12",
    title: "La Historia Aún Sigue",
    tag: "12 • Continuidad",
    message: "Esto no es un punto final; las personas que dejan una huella bonita siempre tienen un lugar especial en la vida ✨",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 11,
  },
  {
    id: "p13",
    title: "Para Nathalia Josefina",
    tag: "13 • Especial",
    message: "Para mi niña consentida: que este y todos tus días estén llenos de la misma luz y alegría que tú transmites 🧸✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 12,
  },
  {
    id: "p14",
    title: "Llegaste Sin Avisar",
    tag: "14 • Destello",
    message: "La vida tiene sus propias formas de llegar sin pedir permiso, y encontrarte en el camino fue un regalo hermoso 🌟",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 13,
  },
  {
    id: "p15",
    title: "Magia en el Aire",
    tag: "15 • Mágico",
    message: "Valía la pena cada aliento, cada suspiro y cada sonrisa que se me escapaba al hablar contigo 💖",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 14,
  },
  {
    id: "p16",
    title: "Una Huella Imborrable",
    tag: "16 • Luz",
    message: "Llegaste cuando menos lo esperaba y me hiciste creer de nuevo en lo bonito y sincero de querer a alguien 💫",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 15,
  },
  {
    id: "p17",
    title: "Soñar a Tu Lado",
    tag: "17 • Ilusión",
    message: "Imaginar momentos felices y compartir charlas sinceras a tu lado me llenó el corazón de alegría 🪐",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 16,
  },
  {
    id: "p18",
    title: "Amor con el Alma",
    tag: "18 • Entrega",
    message: "Lo más puro que tenía para dar te lo entregué con total transparencia, cariño y respeto 🌹",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 17,
  },
  {
    id: "p19",
    title: "Tranquilidad Única",
    tag: "19 • Paz",
    message: "Contigo aprendí lo que significa tener paz y disfrutar de las conversaciones más simples pero significativas ✨",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 18,
  },
  {
    id: "p20",
    title: "Tus Ocurrencias Divertidas",
    tag: "20 • Alegría",
    message: "Tus salidas inesperadas, tus gestos divertidos y esa forma de ser que te hace totalmente única e irrepetible 🧸",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 19,
  },
  {
    id: "p21",
    title: "Sonrisas Compartidas",
    tag: "21 • Destellos",
    message: "Si tuviera que elegir mis momentos favoritos, en todos ellos estás tú sonriendo y contagiando tu vibra 💖",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 20,
  },
  {
    id: "p22",
    title: "Cuidar lo Valioso",
    tag: "22 • Valor",
    message: "Los sentimientos sinceros son como estrellas: brillan en la oscuridad y se cuidan con el alma 🌟",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 21,
  },
  {
    id: "p23",
    title: "Deseos de Corazón",
    tag: "23 • Buenos Deseos",
    message: "Deseo de todo corazón que cumplas cada una de tus metas, que te rodees de gente buena y que nunca dejes de sonreír ✨",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 22,
  },
  {
    id: "p24",
    title: "La Nostalgia Bonita",
    tag: "24 • Gratitud",
    message: "Recordar con cariño lo vivido es el mejor regalo de haber querido con toda el alma y sin reservas 💫",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 23,
  },
  {
    id: "p25",
    title: "Puerta Siempre Abierta",
    tag: "25 • Siempre Ahí",
    message: "Si algún día necesitas hablar o simplemente que alguien te escuche, aquí estaré siempre para ti 🌹",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "orbita",
    audioBlob: null,
    audioName: null,
    order: 24,
  },
  {
    id: "p26",
    title: "Luz en la Galaxia",
    tag: "26 • Nebulosa",
    message: "Mil millones de estrellas en el cielo y ninguna se compara con el brillo que tienes cuando eres feliz 🌌",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "venus",
    audioBlob: null,
    audioName: null,
    order: 25,
  },
  {
    id: "p27",
    title: "Universo Compartido",
    tag: "27 • Órbita",
    message: "No hace falta un planeta entero: cuando hay cariño y complicidad, cualquier lugar se siente como hogar 🪐",
    imageUrl: cosmos3,
    imageBlob: null,
    melody: "latido",
    audioBlob: null,
    audioName: null,
    order: 26,
  },
  {
    id: "p28",
    title: "Caminar Sin Prisa",
    tag: "28 • Sendero",
    message: "Caminar bajo las luces de neón, disfrutando de cada canción y de los recuerdos que nos hicieron sonreír 🎵💖",
    imageUrl: cosmos4,
    imageBlob: null,
    melody: "deriva",
    audioBlob: null,
    audioName: null,
    order: 27,
  },
  {
    id: "p29",
    title: "Un Abrazo Cósmico",
    tag: "29 • Abrazo",
    message: "A través del tiempo y del espacio, los recuerdos bonitos siempre reconfortan el corazón 🧸✨",
    imageUrl: cosmos1,
    imageBlob: null,
    melody: "cristal",
    audioBlob: null,
    audioName: null,
    order: 28,
  },
  {
    id: "p30",
    title: "Siempre con Cariño",
    tag: "30 • Deivis",
    message: "De mi universo para el tuyo: gracias por haber formado parte de mi vida y dejar una huella tan linda. Att: Deivis 💖",
    imageUrl: cosmos2,
    imageBlob: null,
    melody: "nocturno",
    audioBlob: null,
    audioName: null,
    order: 29,
  },
];

const DB_NAME = "album-galaxia-v5";
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
      indexedDB.deleteDatabase("album-galaxia-v4");
    } catch {}

    const db = await openDb();
    const rows = await new Promise<Plate[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as Plate[]);
      req.onerror = () => reject(req.error);
    });

    if (!rows.length || rows.length < 30) {
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
