# Architecture

## Goals

- Offline-first learning experience: no external APIs, everything runs locally.
- Clean separation between UI and learning logic.
- Future-ready for later AI/camera-based validation:
  - the Sign module defines detector/validator ports
  - UI uses interfaces rather than hard-coding any recognition implementation

## Code Organization

- `app/`
  - Route entry points for `dashboard`, `morse-code`, `sign-language`, and `braille`.
  - Pages stay thin: they mainly render the relevant module component.
- `components/`
  - `components/modules/*`: UI for each learning experience (Morse, Sign, Braille).
  - `components/sign/*`: sign learning UI building blocks (alphabet/word/sentence + 3D hand viewer).
  - `components/braille/*`: Braille learning UI building blocks (dot cells + interactive input).
  - `components/ui/*`: shared visual primitives (cards, progress bars, etc.).
- `modules/`
  - Pure learning logic and data:
    - `modules/morse/*`: Morse mappings, tap timing rules, challenge definitions
    - `modules/sign/*`: sign learning parsing/utilities plus detector/validator interface ports
    - `modules/braille/*`: braille mappings + challenge metadata
- `lib/`
  - `lib/progress/*`: localStorage-backed XP + streak + completion tracking
  - `lib/mode-metadata.ts`: display metadata for the dashboard
- `hooks/`
  - `hooks/use-local-progress.ts`: client hook for reading/updating local progress
  - `hooks/use-local-dashboard.ts`: derives dashboard stats and completion %

## Local Progress System (`localStorage`)

Location: `lib/progress/progress-store.ts` and `hooks/use-local-progress.ts`

- Storage key: `silentink.localProgress.v1`
- Persisted state:
  - `xp`: total XP
  - `streakDays`: daily streak counter (calendar day based)
  - `todayISODate` + `todayFocusCount`: lightweight proxy used as "today minutes"
  - `modeProgress[mode].completedChallengeIds`: unique completed challenge identifiers
- Safety + resilience:
  - `readProgressFromStorage()` and `writeProgressToStorage()` wrap `localStorage` access in `try/catch`
  - state is normalized on load (version check, safe defaults, unique completed challenge ids)
  - client hydration avoids mismatch by loading persisted progress after mount (`setTimeout(0)`)
- XP + streak rules:
  - Award XP on correct answers: `+10 XP` per correct attempt.
  - Streak increments when a correct attempt happens on a new day:
    - consecutive days => streak + 1
    - missed day(s) => streak resets to 1
  - Completion % is computed from `completedChallengeIds` vs known per-mode totals.

## Morse Interaction Logic

Location:
- `modules/morse/morse-utils.ts` for timing + validation helpers
- `modules/morse/morse-lessons.ts` for per-challenge expected sequences
- `components/modules/morse/*` for the UI

- Input capture:
  - A single pointer pad measures press duration:
    - short tap (<200ms) => "."
    - long press (>200ms) => "-"
- Reliability:
  - input emission is debounced and guarded against ghost/double pointer events
  - press-to-symbol logic is encapsulated in `components/modules/morse/use-morse-press-input.ts`
- Learning flow:
  - The Morse sequence is built incrementally from user presses.
  - Real-time feedback uses `getMatchState(current, expected)`:
    - empty => idle prompt
    - prefix => "matching" hint
    - exact => ready to submit
    - mismatch => gentle retry hint (no punitive UX)
- Submit-based validation:
  - Submit compares the entered sequence with the expected sequence.
  - On correct: success glow + XP award + ability to continue to the next challenge.
  - Challenge kinds:
    - `kind: "encode"`: prompt shows the letter/word to encode
    - `kind: "decode"`: prompt shows Morse; a decoded character is revealed on success

## Sign Learning System Architecture (Camera-ready later)

Locations:
- `lib/signs.ts`
  - Primary learning metadata:
    - `SIGN_LETTERS` (A–Z): label, instruction, and optional future pose/animation keys
    - `SIGN_WORDS`: word targets for the word builder
    - `SIGN_SENTENCES`: sentence targets for sentence mode
- `modules/sign/sign-types.ts`
  - Defines detector/validator ports:
    - `HandSignDetectorPort`
    - `SignPracticeValidatorPort`
- `modules/sign/sign-utils.ts`
  - Lightweight parsing + challenge-id helpers (letters/words/sentences).
- `components/sign/*`
  - `HandDisplay.tsx`: rendering abstraction consumed by lessons
  - `HandScene.tsx`: lightweight Three.js Canvas + `useGLTF` loading from `public/`
  - `AlphabetGrid.tsx`, `SignLessonCard.tsx`: per-letter learning + self-guided practice
  - `WordBuilder.tsx`: learn/practice word spelling flow
  - `SentenceBuilder.tsx`: learn/practice sentence flow as word+letter sequencing
- `components/modules/sign/sign-camera-validation-extension.tsx`
  - A plug-in boundary that will host camera validation UI later (not implemented now).

How camera validation plugs in later (without refactors):
- A future hand-tracking layer would implement `HandSignDetectorPort` (MediaPipe/TensorFlow.js).
- A `SignPracticeValidatorPort` implementation would compare expected vs detected candidates.
- The lessons already keep practice “self-guided” today; validation can later be wired into the practice step UI through the existing extension boundary.

