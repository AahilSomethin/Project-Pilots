import type { LearningMode, ModeSummary } from "@/lib/types";

export type ModeMeta = Pick<
  ModeSummary,
  "slug" | "title" | "subtitle" | "accent"
>;

export const MODE_META: Record<LearningMode, ModeMeta> = {
  "sign-language": {
    slug: "sign-language",
    title: "Sign Language",
    subtitle: "Express through movement and form",
    accent: "teal",
  },
  "morse-code": {
    slug: "morse-code",
    title: "Morse Code",
    subtitle: "Tap rhythm and timing, no sound needed",
    accent: "blue",
  },
  braille: {
    slug: "braille",
    title: "Braille Learning",
    subtitle: "6-dot patterns and word spelling drills",
    accent: "coral",
  },
};

