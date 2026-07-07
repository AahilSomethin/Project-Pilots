export type LearningMode = "sign-language" | "morse-code" | "braille";

export interface ModeSummary {
  slug: LearningMode;
  title: string;
  subtitle: string;
  accent: "teal" | "blue" | "coral";
  completion: number;
  lessonsCompleted: number;
}

export interface DashboardStats {
  currentXp: number;
  weeklyXpTarget: number;
  streakDays: number;
  todayMinutes: number;
}

export interface LessonStep {
  id: string;
  title: string;
  detail: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: number;
  xpReward: number;
  steps: LessonStep[];
}

export interface Flashcard {
  prompt: string;
  answer: string;
}
