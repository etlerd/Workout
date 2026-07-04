import type { Program } from '../types'

export const seedPrograms: Program[] = [
  {
    id: 'full-body-starter',
    name: 'Full Body Starter',
    description: 'A simple 3-day full-body program for building a strength base.',
    days: [
      {
        id: 'fbs-day-1',
        name: 'Day 1',
        exercises: [
          { exerciseId: 'barbell-back-squat', targetSets: 3, targetReps: '5' },
          { exerciseId: 'bench-press', targetSets: 3, targetReps: '5' },
          { exerciseId: 'barbell-row', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'plank', targetSets: 3, targetReps: '30-60s' },
        ],
      },
      {
        id: 'fbs-day-2',
        name: 'Day 2',
        exercises: [
          { exerciseId: 'deadlift', targetSets: 1, targetReps: '5' },
          { exerciseId: 'overhead-press', targetSets: 3, targetReps: '5' },
          { exerciseId: 'pull-up', targetSets: 3, targetReps: '6-10' },
          { exerciseId: 'hanging-leg-raise', targetSets: 3, targetReps: '10-15' },
        ],
      },
      {
        id: 'fbs-day-3',
        name: 'Day 3',
        exercises: [
          { exerciseId: 'goblet-squat', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'push-up', targetSets: 3, targetReps: 'AMRAP' },
          { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '8-12' },
          { exerciseId: 'russian-twist', targetSets: 3, targetReps: '20' },
        ],
      },
    ],
  },
  {
    id: 'push-pull-legs',
    name: 'Push Pull Legs',
    description: 'A 3-day split targeting pushing muscles, pulling muscles, and legs.',
    days: [
      {
        id: 'ppl-push',
        name: 'Push',
        exercises: [
          { exerciseId: 'bench-press', targetSets: 4, targetReps: '6-8' },
          { exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'dumbbell-fly', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'triceps-pushdown', targetSets: 3, targetReps: '10-15' },
        ],
      },
      {
        id: 'ppl-pull',
        name: 'Pull',
        exercises: [
          { exerciseId: 'deadlift', targetSets: 3, targetReps: '5' },
          { exerciseId: 'pull-up', targetSets: 4, targetReps: '6-10' },
          { exerciseId: 'barbell-row', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'face-pull', targetSets: 3, targetReps: '12-15' },
          { exerciseId: 'dumbbell-bicep-curl', targetSets: 3, targetReps: '10-12' },
        ],
      },
      {
        id: 'ppl-legs',
        name: 'Legs',
        exercises: [
          { exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: '6-8' },
          { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8-10' },
          { exerciseId: 'leg-press', targetSets: 3, targetReps: '10-12' },
          { exerciseId: 'dumbbell-lunge', targetSets: 3, targetReps: '10 each leg' },
        ],
      },
    ],
  },
  {
    id: 'machine-foundation-circuit',
    name: 'Machine Circuit — Foundation Phase',
    description:
      'A full-body machine circuit for returning to training after deconditioning. Follow the 6/10 effort rule: after your working sets you should feel like you could have done about 5 more reps. These starting weights will likely feel light — that’s correct. Connective tissue (tendons, ligaments) adapts slower than muscle, so the first two weeks are investment, not achievement. All exercises are on Cybex machines except the recumbent bike.',
    days: [
      {
        id: 'foundation-day-1',
        name: 'Full Body Circuit',
        exercises: [
          { exerciseId: 'recumbent-bike', targetSets: 1, targetReps: '5-10 min warm-up', targetWeight: 'Resistance level 3-4' },
          { exerciseId: 'leg-press', targetSets: 2, targetReps: '12', targetWeight: '70-90 lbs, high foot placement' },
          { exerciseId: 'seated-row-machine', targetSets: 2, targetReps: '12', targetWeight: '40-50 lbs' },
          { exerciseId: 'chest-press-machine', targetSets: 2, targetReps: '12', targetWeight: '30-40 lbs' },
          { exerciseId: 'lat-pulldown', targetSets: 2, targetReps: '12', targetWeight: '40-50 lbs' },
          { exerciseId: 'triceps-pushdown', targetSets: 2, targetReps: '12', targetWeight: '15-20 lbs' },
          { exerciseId: 'cable-bicep-curl', targetSets: 2, targetReps: '12', targetWeight: '15-20 lbs' },
          { exerciseId: 'hip-abductor-machine', targetSets: 2, targetReps: '12', targetWeight: '50-70 lbs, start low' },
          { exerciseId: 'hip-adductor-machine', targetSets: 2, targetReps: '12', targetWeight: '50-70 lbs, start low' },
        ],
      },
    ],
  },
]
