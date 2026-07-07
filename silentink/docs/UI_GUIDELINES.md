# UI Guidelines

## Visual Language

- Background: `#0F0F0F`
- Surface: `#1A1A1A`
- Accent Teal: `#2EC4B6`
- Accent Blue: `#3FA7D6`
- Accent Coral: `#FF6B6B`
- Use sharp edges and geometric spacing for a premium feel.

## Layout Rules

- Prioritize clarity over density.
- Keep cards and sections aligned to a consistent grid.
- Favor spacing rhythm (`gap`, `padding`, `margin`) over decorative separators.
- Avoid heavy gradients and bubbly rounded shapes.

## Components

- **Card System:** single border style with dark surfaces and subtle accent borders
- **Progress Bars:** slim horizontal bars with accent fills
- **Mode Grid:** compact, scan-friendly cards for mode selection
- **Lesson Player:** clear step title, supporting detail, and next/back controls

## Motion Rules

- Keep animation subtle and purposeful.
- Allowed motion properties: `opacity`, `translate`, `scale`.
- Typical durations: `150ms` to `300ms`.
- Avoid spring-heavy or attention-stealing effects.
- Respect `prefers-reduced-motion` by reducing or disabling animations.

## Silent Experience

- No sound cues.
- Feedback is visual: glow, border emphasis, and micro-interactions.
- Maintain calm interaction pacing to support focus.
