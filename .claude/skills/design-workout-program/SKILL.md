---
name: design-workout-program
description: Design a new workout program conversationally with the user and add it to this app's program/exercise library (src/data/seedPrograms.ts, src/data/seedExercises.ts), then validate, test in a browser, and ship it through this repo's branch/PR workflow. Use when the user wants to create, design, or add a new workout program/routine to the Workout app.
---

# Design Workout Program

This skill turns a conversation about training goals into a real `Program` entry
in this app's seed data, wired up to the exercise library, tested, and deployed.

## 1. Gather the program design

Before writing any code, make sure you know (ask if not already given):

- **Goal / split style** — full body, push/pull/legs, upper/lower, a specific
  focus (e.g. mobility, deconditioned-beginner, powerlifting peaking), etc.
- **Number of days** and what each day covers.
- **Experience level** and any constraints (injuries, equipment available,
  session length).
- **Rep/set scheme** — straight sets (e.g. "3x10"), ranges (e.g. "8-12"),
  AMRAP, time-based (e.g. "20-30 min"), etc.
- **Starting weights**, if the user wants target-weight hints — these should
  be concrete, personalized numbers (like the "Machine Circuit — Foundation
  Phase" program already in this repo), not generic advice.

Don't guess the split or exercise selection if the user hasn't specified it —
propose a draft and confirm before writing files, the same way you would for
any other implementation choice with real tradeoffs.

## 2. Data model reference

Read `src/types.ts` for the authoritative shape. As of this writing:

```ts
export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core' | 'Full Body' | 'Cardio'

export type Equipment =
  | 'Bodyweight' | 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Machine' | 'Cable' | 'Bands' | 'Other'

export interface Exercise {
  id: string             // kebab-case, unique, e.g. "barbell-back-squat"
  name: string
  category: MuscleGroup
  equipment: Equipment
  instructions: string[] // 3-5 imperative steps
  tips: string[]          // 1-3 form cues
}

export interface ProgramExercise {
  exerciseId: string
  targetSets: number
  targetReps: string      // e.g. "12", "8-12", "AMRAP", "5-10 min warm-up"
  targetWeight?: string   // e.g. "70-90 lbs", "Resistance level 3-4"
}

export interface ProgramDay {
  id: string   // kebab-case, unique within the program
  name: string
  exercises: ProgramExercise[]
}

export interface Program {
  id: string   // kebab-case, unique across ALL programs
  name: string
  description: string
  days: ProgramDay[]
}
```

Weights are in **lbs** app-wide (not kg) — see `SetEntry.weightLb`.

## 3. Reuse exercises before adding new ones

Read `src/data/seedExercises.ts` first. Match the user's program against what
already exists there (there are ~30 exercises covering barbell/dumbbell/cable/
machine/bodyweight/cardio movements). Only add a new `Exercise` entry when
nothing already fits — reusing an existing `exerciseId` keeps progress charts
and history consistent across programs.

When you do add a new exercise, append it to the array in
`src/data/seedExercises.ts` following the existing style: kebab-case `id`,
3-5 step `instructions`, 1-3 `tips`. No `custom: true` flag — that's reserved
for exercises users add themselves through the UI.

## 4. Write the program

Append the new `Program` object to the array in `src/data/seedPrograms.ts`,
following the existing style (see the `machine-foundation-circuit` entry for
a fully-worked example with target weights and a motivational description).

**`targetReps` / `targetWeight` formatting directly controls auto-prefill**
(see `src/utils/targetParsing.ts`):
- A plain number or range (`"12"`, `"8-12"`) in `targetReps` prefills that
  many reps per set (averaged for a range).
- A range followed by `"min"` (`"5-10 min warm-up"`) prefills **minutes** of
  duration instead of reps.
- Anything else (`"AMRAP"`, `"10 each leg"`) is left blank for the user to
  fill in — don't fight this, it's intentional.
- A plain number/range anywhere in `targetWeight` (`"70-90 lbs, high foot
  placement"`) prefills that weight in lbs (averaged). Including the word
  `"resistance"` or `"level"` (e.g. `"Resistance level 3-4"`) suppresses
  weight prefill, since that's not actually a poundage.

No migration step is needed for existing users: `src/data/repo.ts` merges any
seed programs/exercises missing from a browser's `localStorage` on next load
(`mergeMissingSeedItems`), so a new program just shows up automatically.

## 5. Validate

From the repo root:

```bash
npx tsc -b --noEmit
npx oxlint .
npm run build && rm -rf dist
```

All three must be clean before moving on.

## 6. Verify in a real browser

Start the dev server on a free port (it serves under the `/Workout/` base
path):

```bash
npm run dev -- --port <port> --strictPort
```

Use Playwright (`chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`)
to open `http://localhost:<port>/Workout/#/programs`, open the new program,
and confirm:
- every exercise resolves a real name (never "Unknown")
- sets/reps/weight per exercise look right
- clicking "Start Workout" on a day prefills the expected reps/weight/duration

Screenshot and actually look at it — don't just trust that the data compiles.
Kill the dev server when done.

## 7. Ship it

This repo's convention (established across prior sessions): commit on the
`claude/workout-tracker-app-w06jih` branch, open a PR into `main`, and merge
it, which auto-deploys via `.github/workflows/deploy.yml` to
https://etlerd.github.io/Workout/.

Because PRs here get merged immediately, the branch is often ahead of a
stale local checkout. Always resync before committing new work:

```bash
git fetch origin main
git checkout -B claude/workout-tracker-app-w06jih origin/main
# re-apply your working-tree changes (they carry over across the reset)
git add -A && git commit -m "..."
git push --force-with-lease -u origin claude/workout-tracker-app-w06jih
```

Then use the GitHub MCP tools to open the PR (`mcp__github__create_pull_request`,
base `main`, head `claude/workout-tracker-app-w06jih`) and merge it
(`mcp__github__merge_pull_request`, `merge_method: "squash"`). Confirm with the
user first if the change is anything beyond "add a program" (e.g. if it also
touches shared components or data model shape).
