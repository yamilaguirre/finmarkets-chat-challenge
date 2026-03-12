// Lista de nombres para generar nombres de usuario aleatorios
const MALE_NAMES = [
  "Juan",
  "Carlos",
  "Luis",
  "Miguel",
  "Jorge",
  "Pedro",
  "Antonio",
  "José",
  "Francisco",
  "Roberto",
  "Diego",
  "Daniel",
  "Alejandro",
  "Fernando",
  "Ricardo",
  "Manuel",
  "Rafael",
  "Sergio",
  "Eduardo",
  "Alberto",
];

const FEMALE_NAMES = [
  "María",
  "Ana",
  "Carmen",
  "Laura",
  "Patricia",
  "Sofía",
  "Isabel",
  "Elena",
  "Rosa",
  "Diana",
  "Gabriela",
  "Valentina",
  "Natalia",
  "Andrea",
  "Carolina",
  "Daniela",
  "Mariana",
  "Lucía",
  "Victoria",
  "Claudia",
];

/**
 * Genera un nombre de usuario aleatorio
 * @returns Un nombre aleatorio de hombre o mujer
 */
export const generateRandomUsername = (): string => {
  // Decidir aleatoriamente entre nombre masculino o femenino
  const allNames = [...MALE_NAMES, ...FEMALE_NAMES];
  const randomIndex = Math.floor(Math.random() * allNames.length);
  return allNames[randomIndex] ?? "Usuario";
};

/**
 * Obtiene el color del avatar basado en el nombre
 * @param name Nombre del usuario
 * @returns Color HSL como string
 */
export const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

/**
 * Obtiene la inicial del nombre
 * @param name Nombre del usuario
 * @returns Primera letra en mayúscula
 */
export const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};
