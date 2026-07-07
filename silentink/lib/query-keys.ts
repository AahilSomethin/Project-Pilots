export const queryKeys = {
  dashboard: ["dashboard"] as const,
  modes: ["modes"] as const,
  lessons: (mode: string) => ["lessons", mode] as const,
  flashcards: (mode: string) => ["flashcards", mode] as const,
};
