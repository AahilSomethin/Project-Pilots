# Features

## Local Progress (offline-first)

- Local XP (+10 per correct quiz answer) stored in `localStorage`
- Daily streak counter based on local calendar days
- Per-mode completion computed from completed challenge identifiers
- Restores progress on reload with a lightweight, readable state model

## Morse Code (primary interactive feature)

- Tap and press Morse input captured via pointer-down duration
  - Short tap (<200ms) => "."
  - Long press (>200ms) => "-"
- Input is handled by a reusable press-to-symbol hook (debounced to avoid ghost/double inputs)
- Live Morse sequence display in a monospace UI
- Validation against the expected Morse sequence for the current challenge
- Sample challenges included:
  - Single letter encoding (ex: "E")
  - Short word encoding (ex: "HI")
  - Decode-style challenge (Morse shown, decoded character revealed on success)
- Gentle feedback:
  - Correct: subtle success glow + success message + XP award
  - Incorrect: subtle red shake + retry hint (not punitive)
- Reset and Submit controls for submit-based validation, plus real-time prefix feedback

## Sign Language (guided learning, camera-ready later)

- Alphabet learning flow (A–Z):
  - Clean A–Z grid and focused per-letter lesson panel
  - Each lesson includes: letter label, short instruction, 3D hand display, and self-guided practice
- Word builder flow:
  - Learn mode spells a target word one letter at a time (hand + instruction per letter)
  - Practice mode lets users review the full spelling sequence with a simple self-check
- Sentence mode (basic):
  - Learn short sentences as a word flow, then practice by spelling through each word’s letters
  - Lightweight, uncluttered sequence UI with clear progression
- Reusable `HandDisplay` abstraction:
  - Lesson components never depend on whether the rendering is a placeholder, Lottie, or Three.js
  - Current renderer uses a lightweight Three.js Canvas with `useGLTF` (GLB model in `public/`)
- Future-ready validation boundary:
  - Camera-based validation is structured via detector/validator “ports” but is not implemented yet

## Braille Learning (6-dot patterns)

- Dot numbering basics (visual 1–6 grid)
- Alphabet system (A–Z):
  - shows each letter’s braille cell + dot pattern
  - users toggle dots to match the target cell
- Validation:
  - correct => green glow + success message + XP award
  - incorrect => subtle red shake + retry hint
- Word mode:
  - learn a target word with guided step-by-step braille spelling

## Interaction & Accessibility

- Silent-first UX (no audio feedback)
- Subtle motion only: opacity, scale, soft glow, and gentle shake
- Honors `prefers-reduced-motion`

