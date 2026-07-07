import {
  DashboardStats,
  Flashcard,
  LearningMode,
  Lesson,
  ModeSummary,
} from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const modeSummaries: ModeSummary[] = [
  {
    slug: "sign-language",
    title: "Sign Language",
    subtitle: "Express through movement and form",
    accent: "teal",
    completion: 62,
    lessonsCompleted: 18,
  },
  {
    slug: "morse-code",
    title: "Morse Code",
    subtitle: "Tap rhythm and timing, no sound needed",
    accent: "blue",
    completion: 41,
    lessonsCompleted: 12,
  },
  {
    slug: "braille",
    title: "Braille Learning",
    subtitle: "6-dot patterns and word spelling drills",
    accent: "coral",
    completion: 55,
    lessonsCompleted: 15,
  },
];

const lessonsByMode: Record<LearningMode, Lesson[]> = {
  "sign-language": [
    {
      id: "sign-1",
      title: "Core Hand Shapes",
      level: 1,
      xpReward: 30,
      steps: [
        { id: "s1", title: "Anchor posture", detail: "Set shoulder and wrist." },
        { id: "s2", title: "Shape precision", detail: "Hold each shape for 2s." },
        { id: "s3", title: "Recall drill", detail: "Match shape to letter." },
      ],
    },
    {
      id: "sign-2",
      title: "Daily Intent Signs",
      level: 2,
      xpReward: 45,
      steps: [
        { id: "s4", title: "Greeting flow", detail: "Sequence hello and thanks." },
        { id: "s5", title: "Context switch", detail: "Change tempo by context." },
      ],
    },
  ],
  "morse-code": [
    {
      id: "morse-1",
      title: "Dots and Dashes",
      level: 1,
      xpReward: 25,
      steps: [
        { id: "m1", title: "Timing basics", detail: "Short tap vs long tap." },
        { id: "m2", title: "Gap rhythm", detail: "Letter and word spacing." },
      ],
    },
    {
      id: "morse-2",
      title: "Common Signals",
      level: 2,
      xpReward: 40,
      steps: [
        { id: "m3", title: "SOS and HELP", detail: "Build urgent patterns." },
        { id: "m4", title: "Name encoding", detail: "Spell your own name." },
      ],
    },
  ],
  braille: [
    {
      id: "br-1",
      title: "Dot Position Basics",
      level: 1,
      xpReward: 35,
      steps: [
        { id: "br1", title: "Dot numbering", detail: "Learn 1-6 dot placement." },
        { id: "br2", title: "Cell patterns", detail: "Recognize braille letter shapes." },
      ],
    },
    {
      id: "br-2",
      title: "Practice Spelling",
      level: 2,
      xpReward: 50,
      steps: [
        { id: "br3", title: "Letter-by-letter input", detail: "Toggle dots to spell words." },
        { id: "br4", title: "Guided word flow", detail: "Validate each spelling step." },
      ],
    },
  ],
};

const flashcardsByMode: Record<LearningMode, Flashcard[]> = {
  "sign-language": [
    { prompt: "Palm out + wave", answer: "Hello" },
    { prompt: "Fingers together, tap chin", answer: "Thank you" },
  ],
  "morse-code": [
    { prompt: "... --- ...", answer: "SOS" },
    { prompt: ".- .... .. .-..", answer: "AHIL" },
  ],
  braille: [
    { prompt: "Letter A", answer: "Dot 1" },
    { prompt: "Letter B", answer: "Dots 1-2" },
  ],
};

const dashboardStats: DashboardStats = {
  currentXp: 1240,
  weeklyXpTarget: 1800,
  streakDays: 17,
  todayMinutes: 22,
};

export async function fetchModeSummaries(): Promise<ModeSummary[]> {
  await delay(160);
  return modeSummaries;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(120);
  return dashboardStats;
}

export async function fetchLessons(mode: LearningMode): Promise<Lesson[]> {
  await delay(200);
  return lessonsByMode[mode];
}

export async function fetchFlashcards(mode: LearningMode): Promise<Flashcard[]> {
  await delay(140);
  return flashcardsByMode[mode];
}
