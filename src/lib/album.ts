import mem01 from "@/assets/memories/memory-01.jpeg";
import mem02 from "@/assets/memories/memory-02.jpeg";
import mem03 from "@/assets/memories/memory-03.jpeg";
import mem04 from "@/assets/memories/memory-04.jpeg";
import mem05 from "@/assets/memories/memory-05.jpeg";
import mem06 from "@/assets/memories/memory-06.jpeg";
import mem07 from "@/assets/memories/memory-07.jpeg";
import mem08 from "@/assets/memories/memory-08.jpeg";
import mem09 from "@/assets/memories/memory-09.jpeg";
import mem10 from "@/assets/memories/memory-10.jpeg";
import mem11 from "@/assets/memories/memory-11.jpeg";
import mem12 from "@/assets/memories/memory-12.jpeg";
import mem13 from "@/assets/memories/memory-13.jpeg";
import mem14 from "@/assets/memories/memory-14.jpeg";
import mem15 from "@/assets/memories/memory-15.jpeg";
import mem16 from "@/assets/memories/memory-16.jpeg";
import mem17 from "@/assets/memories/memory-17.jpeg";
import mem18 from "@/assets/memories/memory-18.jpeg";
import mem19 from "@/assets/memories/memory-19.jpeg";
import mem20 from "@/assets/memories/memory-20.jpeg";
import mem21 from "@/assets/memories/memory-21.jpeg";
import mem22 from "@/assets/memories/memory-22.jpeg";
import mem23 from "@/assets/memories/memory-23.mp4";
import mem24 from "@/assets/memories/memory-24.mp4";
import mem25 from "@/assets/memories/memory-25.mp4";
import mem26 from "@/assets/memories/memory-26.mp4";
import mem27 from "@/assets/memories/memory-27.mp4";
import mem28 from "@/assets/memories/memory-28.mp4";
import mem29 from "@/assets/memories/memory-29.mp4";
import mem30 from "@/assets/memories/memory-30.png";

export type Plate = {
  id: string;
  title: string;
  tag: string;
  message: string;
  imageUrl: string | null;
  imageBlob: Blob | null;
  isVideo?: boolean;
  rotation?: number;
  melody: string;
  audioUrl?: string | null;
  audioName: string | null;
  audioBlob: Blob | null;
  order: number;
};

export const DEFAULT_PLATES: Plate[] = [
  {
    id: "p1",
    title: "La Casualidad de Messenger",
    tag: "01 • El Comienzo",
    message: "Recuerdo perfectamente cómo empezamos: aquella confusión por Messenger, por pura casualidad, fue el inicio de algo maravilloso ✨",
    imageUrl: mem01,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Distancia.mp3",
    audioName: "3AM - Distancia",
    audioBlob: null,
    order: 0,
  },
  {
    id: "p2",
    title: "El Primer Destello",
    tag: "02 • Chispa",
    message: "Al principio yo no buscaba nada, pero tu forma de ser, tus risas y tus charlas me hicieron cambiar de parecer por completo 💫",
    imageUrl: mem15,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Por_Ti.mp3",
    audioName: "3AM - Por Ti",
    audioBlob: null,
    order: 1,
  },
  {
    id: "p3",
    title: "Nuestras Bromas en Casa",
    tag: "03 • Risas",
    message: "Aquellas tardes compartiendo tiempo, las risas interminables y las bromas que solo nosotros entendíamos 🌹",
    imageUrl: mem02,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Una_Rosa.mp3",
    audioName: "3AM - Una Rosa",
    audioBlob: null,
    order: 2,
  },
  {
    id: "p4",
    title: "Nuestros Videos y Risas",
    tag: "04 • Video Recuerdo 🎬",
    message: "Cada video guarda la chispa viva de tus ocurrencias, tus sonrisas y esos instantes que no cambio por nada 🎥✨",
    imageUrl: mem23,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Vidas_pasadas.mp3",
    audioName: "3AM - Vidas pasadas",
    audioBlob: null,
    order: 3,
  },
  {
    id: "p5",
    title: "Dejar de Verla como Amiga",
    tag: "05 • Sentimiento",
    message: "Llegó un momento en el que ya no te miraba solo como una amiga: empecé a quererte y a sentir algo único 💖",
    imageUrl: mem03,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Vuela.mp3",
    audioName: "3AM - Vuela",
    audioBlob: null,
    order: 4,
  },
  {
    id: "p6",
    title: "Creer en lo Imposible",
    tag: "06 • Ilusión",
    message: "Una vez me preguntaste si te quería... Y siempre sigo aquí, porque contigo elegí creer en lo imposible y en la magia de quererte ✨",
    imageUrl: mem04,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_Andrea_Ferrero_-_Quedate.mp3",
    audioName: "3AM Andrea Ferrero - Quedate",
    audioBlob: null,
    order: 5,
  },
  {
    id: "p7",
    title: "Forjar Nuestro Destino",
    tag: "07 • Constelación",
    message: "No creo en sentarme a esperar el destino; prefiero construirlo a tu lado con hechos, paciencia y cariño sincero 🪐",
    imageUrl: mem05,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_Micro_TDH_-_LA_CASA.mp3",
    audioName: "3AM, Micro TDH - LA CASA",
    audioBlob: null,
    order: 6,
  },
  {
    id: "p8",
    title: "Momentos en Movimiento",
    tag: "08 • Video Recuerdo 🎬",
    message: "Verte en movimiento y escuchar tus risas es recordar por qué cada momento valió completamente la pena 💫🎥",
    imageUrl: mem24,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Bruno_Mars_-_Lo_Arriesgo_Todo.mp3",
    audioName: "Bruno Mars - Lo Arriesgo Todo",
    audioBlob: null,
    order: 7,
  },
  {
    id: "p9",
    title: "Demostrar con Hechos",
    tag: "09 • Sinceridad",
    message: "Elegí estar a tu lado demostrándote que lo mío era en serio, honesto y nacido desde lo más puro del corazón 💫",
    imageUrl: mem06,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Diciembre_Sin_Ti_-_Jarah.mp3",
    audioName: "Diciembre Sin Ti - Jarah",
    audioBlob: null,
    order: 8,
  },
  {
    id: "p10",
    title: "Querer Sin Fecha de Caducidad",
    tag: "10 • Eterno",
    message: "Es mentira que voy a dejar de quererte: eso no se borra ni hoy, ni mañana, ni con el paso del tiempo 🌌",
    imageUrl: mem07,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Ed_Sheeran_-_Forever_My_Love.mp3",
    audioName: "Ed Sheeran - Forever My Love",
    audioBlob: null,
    order: 9,
  },
  {
    id: "p11",
    title: "La Música de Nuestra Historia",
    tag: "11 • Melodía",
    message: "Cada acorde me recuerda a ti y a nuestras anécdotas compartidas en esta sincronía cósmica tan bonita 🎵✨",
    imageUrl: mem08,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Ed_Sheeran_-_Photograph.mp3",
    audioName: "Ed Sheeran - Photograph",
    audioBlob: null,
    order: 10,
  },
  {
    id: "p12",
    title: "La Magia de Verte Reír",
    tag: "12 • Video Recuerdo 🎬",
    message: "Tu risa ilumina más que cualquier galaxia entera; un recuerdo guardado para siempre en el corazón 🌹🎥",
    imageUrl: mem25,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Elvis_Presley_Cant_Help_Falling_In_Love.mp3",
    audioName: "Elvis Presley — Can't Help Falling In Love",
    audioBlob: null,
    order: 11,
  },
  {
    id: "p13",
    title: "Tú de 19 y Yo de 23",
    tag: "13 • Casualidad",
    message: "Esa coincidencia de momentos y ocurrencias que nos hizo reír tantas veces: casualidades que se vuelven magia 💫",
    imageUrl: mem09,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/JVKE_-_Golden_Hour.mp3",
    audioName: "JVKE - Golden Hour",
    audioBlob: null,
    order: 12,
  },
  {
    id: "p14",
    title: "Apoyarte Siempre",
    tag: "14 • Incondicional",
    message: "Estaré allí para ti siempre que me necesites, para escucharte, cuidarte y celebrar cada uno de tus logros 🌹",
    imageUrl: mem16,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Lady_Gaga_Bruno_Mars_-_Die_With_A_Smile.mp3",
    audioName: "Lady Gaga, Bruno Mars - Die With A Smile",
    audioBlob: null,
    order: 13,
  },
  {
    id: "p15",
    title: "La Historia Aún Sigue",
    tag: "15 • Continuidad",
    message: "Esto no es un punto final; las personas que dejan una huella bonita siempre tienen un lugar especial en la vida ✨",
    imageUrl: mem10,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Olvdala_-_3AM_Beret.mp3",
    audioName: "Olvídala - 3AM, Beret",
    audioBlob: null,
    order: 14,
  },
  {
    id: "p16",
    title: "Instantes Cósmicos",
    tag: "16 • Video Recuerdo 🎬",
    message: "Pequeños clips de momentos espontáneos que se convirtieron en recuerdos inolvidables 🪐✨",
    imageUrl: mem26,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Q_VUELTA_-_JARAH.mp3",
    audioName: "Q VUELTA - JARAH",
    audioBlob: null,
    order: 15,
  },
  {
    id: "p17",
    title: "Para Nathalia Josefina",
    tag: "17 • Especial",
    message: "Para mi niña consentida: que este y todos tus días estén llenos de la misma luz y alegría que tú transmites 🧸✨",
    imageUrl: mem11,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Sebastian_Yatra_-_Cristina.mp3",
    audioName: "Sebastian Yatra - Cristina",
    audioBlob: null,
    order: 16,
  },
  {
    id: "p18",
    title: "Llegaste Sin Avisar",
    tag: "18 • Destello",
    message: "La vida tiene sus propias formas de llegar sin pedir permiso, y encontrarte en el camino fue un regalo hermoso 🌟",
    imageUrl: mem12,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Sebastin_Yatra_-_Cmo_Mirarte.mp3",
    audioName: "Sebastián Yatra - Cómo Mirarte",
    audioBlob: null,
    order: 17,
  },
  {
    id: "p19",
    title: "Magia en el Aire",
    tag: "19 • Mágico",
    message: "Valía la pena cada aliento, cada suspiro y cada sonrisa que se me escapaba al hablar contigo 💖",
    imageUrl: mem13,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Sebastin_Yatra_Augusto_Alonso_-_Lo_Que_Me_Pasa_Con_Vos.mp3",
    audioName: "Sebastián Yatra, Augusto Alonso - Lo Que Me Pasa Con Vos",
    audioBlob: null,
    order: 18,
  },
  {
    id: "p20",
    title: "Nuestra Sintonía",
    tag: "20 • Video Recuerdo 🎬",
    message: "Compartir estos instantes contigo me hizo inmensamente feliz. La vida es más bonita con tu presencia 💖🎥",
    imageUrl: mem27,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Jara_-_Dios_Te_Hizo_Perfecta.mp3",
    audioName: "Jara - Dios Te Hizo Perfecta",
    audioBlob: null,
    order: 19,
  },
  {
    id: "p21",
    title: "Una Huella Imborrable",
    tag: "21 • Luz",
    message: "Llegaste cuando menos lo esperaba y me hiciste creer de nuevo en lo bonito y sincero de querer a alguien 💫",
    imageUrl: mem14,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Jara_-_Adicto_a_Tu_Piel.mp3",
    audioName: "Jara - Adicto a Tu Piel",
    audioBlob: null,
    order: 20,
  },
  {
    id: "p22",
    title: "Soñar a Tu Lado",
    tag: "22 • Ilusión",
    message: "Imaginar momentos felices y compartir charlas sinceras a tu lado me llenó el corazón de alegría 🪐",
    imageUrl: mem18,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/JVKE_-_Golden_Hour.mp3",
    audioName: "JVKE - Golden Hour",
    audioBlob: null,
    order: 21,
  },
  {
    id: "p23",
    title: "Amor con el Alma",
    tag: "23 • Entrega",
    message: "Lo más puro que tenía para dar te lo entregué con total transparencia, cariño y respeto 🌹",
    imageUrl: mem19,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Ed_Sheeran_-_Photograph.mp3",
    audioName: "Ed Sheeran - Photograph",
    audioBlob: null,
    order: 22,
  },
  {
    id: "p24",
    title: "Ocurrencias en Cámara",
    tag: "24 • Video Recuerdo 🎬",
    message: "Tus gestos únicos, tu energía bonita y cada travesura que quedó grabada para siempre 🧸🎥",
    imageUrl: mem28,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Elvis_Presley_Cant_Help_Falling_In_Love.mp3",
    audioName: "Elvis Presley — Can't Help Falling In Love",
    audioBlob: null,
    order: 23,
  },
  {
    id: "p25",
    title: "Tranquilidad Única",
    tag: "25 • Paz",
    message: "Contigo aprendí lo que significa tener paz y disfrutar de las conversaciones más simples pero significativas ✨",
    imageUrl: mem20,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Lady_Gaga_Bruno_Mars_-_Die_With_A_Smile.mp3",
    audioName: "Lady Gaga, Bruno Mars - Die With A Smile",
    audioBlob: null,
    order: 24,
  },
  {
    id: "p26",
    title: "Tus Ocurrencias Divertidas",
    tag: "26 • Alegría",
    message: "Tus salidas inesperadas, tus gestos divertidos y esa forma de ser que te hace totalmente única e irrepetible 🧸",
    imageUrl: mem17,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Sebastian_Yatra_-_Cristina.mp3",
    audioName: "Sebastian Yatra - Cristina",
    audioBlob: null,
    order: 25,
  },
  {
    id: "p27",
    title: "Sonrisas Compartidas",
    tag: "27 • Destellos",
    message: "Si tuviera que elegir mis momentos favoritos, en todos ellos estás tú sonriendo y contagiando tu vibra 💖",
    imageUrl: mem21,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Sebastin_Yatra_-_Cmo_Mirarte.mp3",
    audioName: "Sebastián Yatra - Cómo Mirarte",
    audioBlob: null,
    order: 26,
  },
  {
    id: "p28",
    title: "Un Abrazo Cósmico",
    tag: "28 • Video Recuerdo 🎬",
    message: "A través del tiempo y del espacio, estos videos siempre me sacan la sonrisa más sincera ✨🎬",
    imageUrl: mem29,
    imageBlob: null,
    isVideo: true,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Por_Ti.mp3",
    audioName: "3AM - Por Ti",
    audioBlob: null,
    order: 27,
  },
  {
    id: "p29",
    title: "Cuidar lo Valioso",
    tag: "29 • Valor",
    message: "Los sentimientos sinceros son como estrellas: brillan en la oscuridad y se cuidan con el alma 🌟",
    imageUrl: mem22,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/3AM_-_Una_Rosa.mp3",
    audioName: "3AM - Una Rosa",
    audioBlob: null,
    order: 28,
  },
  {
    id: "p30",
    title: "Siempre con Cariño",
    tag: "30 • Deivis",
    message: "De mi universo para el tuyo: gracias por haber formado parte de mi vida y dejar una huella tan linda. Att: Deivis 💖",
    imageUrl: mem30,
    imageBlob: null,
    isVideo: false,
    rotation: 0,
    melody: "orbita",
    audioUrl: "/music/Jara_-_Dios_Te_Hizo_Perfecta.mp3",
    audioName: "Jara - Dios Te Hizo Perfecta",
    audioBlob: null,
    order: 29,
  }
];

const DB_NAME = "album-galaxia-v35";
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
      for (let i = 1; i <= 34; i++) {
        indexedDB.deleteDatabase(i === 1 ? "album-galaxia" : `album-galaxia-v${i}`);
      }
    } catch {}

    const db = await openDb();
    const rows = await new Promise<Plate[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as Plate[]);
      req.onerror = () => reject(req.error);
    });

    if (!rows.length || rows.length < 25) {
      await Promise.all(DEFAULT_PLATES.map(savePlate));
      return [...DEFAULT_PLATES];
    }

    // Asegurar que cada recuerdo siempre conserve el nombre y URL real de su música
    const fixedRows = rows.map((r) => {
      const def = DEFAULT_PLATES.find((d) => d.id === r.id);
      return {
        ...r,
        audioName: r.audioName || def?.audioName || null,
        audioUrl: r.audioUrl || def?.audioUrl || null,
        rotation: r.rotation !== undefined ? r.rotation : (def?.rotation || 0)
      };
    });

    return fixedRows.sort((a, b) => a.order - b.order);
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

export const isMediaVideo = (plate: Plate, url: string): boolean => {
  if (plate.isVideo !== undefined) return plate.isVideo;
  const target = (url || plate.imageUrl || "").toLowerCase();
  return (
    target.endsWith(".mp4") ||
    target.endsWith(".webm") ||
    target.includes("video/mp4") ||
    target.includes(".mp4?")
  );
};
