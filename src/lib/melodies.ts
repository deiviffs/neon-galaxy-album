export type Melody = {
  key: string;
  name: string;
  pad: number[];
  scale: number[];
  interval: number;
};

export const MELODIES: Melody[] = [
  {
    key: "orbita",
    name: "Órbita Infinita",
    pad: [110, 164.81, 220, 329.63],
    scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
    interval: 900,
  },
  {
    key: "venus",
    name: "Luz de Venus",
    pad: [123.47, 185, 246.94, 370],
    scale: [587.33, 659.25, 739.99, 880, 987.77],
    interval: 1050,
  },
  {
    key: "latido",
    name: "Latido Rosa",
    pad: [98, 146.83, 196, 293.66],
    scale: [392, 440, 493.88, 587.33, 659.25],
    interval: 780,
  },
  {
    key: "deriva",
    name: "Deriva Lenta",
    pad: [87.31, 130.81, 174.61, 261.63],
    scale: [349.23, 392, 440, 523.25, 587.33],
    interval: 1250,
  },
  {
    key: "cristal",
    name: "Cristal Aqua",
    pad: [130.81, 196, 261.63, 392],
    scale: [1046.5, 1174.66, 1318.51, 1567.98],
    interval: 650,
  },
  {
    key: "nocturno",
    name: "Nocturno",
    pad: [110, 130.81, 164.81, 220],
    scale: [440, 523.25, 587.33, 659.25, 880],
    interval: 1000,
  },
];

export const getMelody = (key: string): Melody => MELODIES.find((m) => m.key === key) ?? MELODIES[0]!;
