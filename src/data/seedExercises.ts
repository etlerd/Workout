import type { Exercise } from '../types'

export const seedExercises: Exercise[] = [
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    equipment: 'Barbell',
    instructions: [
      'Set the bar on a rack at upper-chest height and step under it, resting it across your upper traps.',
      'Un-rack the bar and step back into a stance about shoulder-width apart, toes slightly turned out.',
      'Brace your core, break at the hips and knees together, and lower until your hip crease passes your knee.',
      'Drive through your whole foot to stand back up, keeping your chest up and knees tracking over your toes.',
    ],
    tips: [
      'Keep the bar over your mid-foot throughout the movement.',
      'Avoid letting your knees cave inward — push them out slightly as you descend.',
    ],
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot.',
      'Hinge at the hips and bend your knees to grip the bar just outside your shins.',
      'Flatten your back, pull the slack out of the bar, and brace your core.',
      'Drive through the floor, extending hips and knees together to stand up straight.',
      'Lower the bar back down by pushing your hips back first, then bending the knees.',
    ],
    tips: [
      'Keep the bar in contact with your legs throughout the lift.',
      'Do not round your lower back — reset if you lose position.',
    ],
  },
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    instructions: [
      'Lie on the bench with eyes under the bar, feet flat on the floor.',
      'Grip the bar slightly wider than shoulder-width and un-rack it over your chest.',
      'Lower the bar under control to your mid-chest, elbows at roughly a 45-degree angle.',
      'Press the bar back up to full lockout.',
    ],
    tips: [
      'Keep your shoulder blades pinched together and feet planted for stability.',
      'Control the descent — don’t bounce the bar off your chest.',
    ],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'Shoulders',
    equipment: 'Barbell',
    instructions: [
      'Hold the bar at shoulder height with hands just outside shoulder-width.',
      'Brace your core and glutes to keep your torso rigid.',
      'Press the bar straight overhead, moving your head back slightly to let it pass, then through.',
      'Lock out overhead with the bar over your mid-foot, then lower back to the shoulders.',
    ],
    tips: [
      'Squeeze your glutes to avoid over-arching your lower back.',
      'Finish with your bicep near your ear at the top.',
    ],
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'Back',
    equipment: 'Bodyweight',
    instructions: [
      'Grip a pull-up bar slightly wider than shoulder-width, palms facing away.',
      'Hang with arms fully extended and core engaged.',
      'Pull yourself up until your chin clears the bar, driving your elbows down and back.',
      'Lower back down under control to a full hang.',
    ],
    tips: [
      'Avoid excessive kipping/swinging if training strength.',
      'Think about pulling your elbows to your hips rather than just lifting your chin.',
    ],
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    category: 'Back',
    equipment: 'Barbell',
    instructions: [
      'Hinge at the hips with a flat back, torso roughly parallel to the floor, holding the bar with hands shoulder-width apart.',
      'Let the bar hang at arm’s length below your chest.',
      'Row the bar up to your lower ribs, driving your elbows back.',
      'Lower the bar back down under control without letting your torso rise.',
    ],
    tips: [
      'Keep your core braced to protect your lower back.',
      'Avoid using momentum from your hips to swing the weight up.',
    ],
  },
  {
    id: 'dumbbell-lunge',
    name: 'Dumbbell Lunge',
    category: 'Legs',
    equipment: 'Dumbbell',
    instructions: [
      'Stand tall holding a dumbbell in each hand at your sides.',
      'Step forward with one leg and lower your hips until both knees are bent around 90 degrees.',
      'Push through your front heel to return to the starting position.',
      'Repeat on the other leg.',
    ],
    tips: [
      'Keep your torso upright and core braced throughout.',
      'Don’t let your front knee collapse inward.',
    ],
  },
  {
    id: 'dumbbell-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'Arms',
    equipment: 'Dumbbell',
    instructions: [
      'Stand holding a dumbbell in each hand, arms fully extended, palms facing forward.',
      'Keeping your elbows pinned to your sides, curl the weights up toward your shoulders.',
      'Squeeze your biceps at the top, then lower under control.',
    ],
    tips: [
      'Avoid swinging your body to generate momentum.',
      'Keep your wrists neutral throughout the curl.',
    ],
  },
  {
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    category: 'Arms',
    equipment: 'Cable',
    instructions: [
      'Stand facing a cable machine with a bar or rope attachment set at the top.',
      'Grip the attachment with elbows tucked at your sides.',
      'Extend your arms down until fully straight, squeezing your triceps.',
      'Let the attachment rise back up under control without moving your elbows.',
    ],
    tips: [
      'Keep your elbows locked in place — only your forearms should move.',
      'Avoid leaning your whole bodyweight into the movement.',
    ],
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    equipment: 'Bodyweight',
    instructions: [
      'Get into a forearm plank position with elbows under your shoulders.',
      'Keep your body in a straight line from head to heels.',
      'Brace your core and glutes, and hold the position while breathing normally.',
    ],
    tips: [
      'Don’t let your hips sag or pike up.',
      'Keep your neck neutral by looking at the floor slightly ahead of your hands.',
    ],
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'Core',
    equipment: 'Bodyweight',
    instructions: [
      'Hang from a pull-up bar with arms fully extended.',
      'Keeping your legs straight (or knees bent for an easier variation), raise them until roughly parallel to the floor.',
      'Lower back down under control without swinging.',
    ],
    tips: [
      'Avoid using momentum — control the descent.',
      'Posteriorly tilt your pelvis at the top to fully engage your abs.',
    ],
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'Full Body',
    equipment: 'Kettlebell',
    instructions: [
      'Stand with feet shoulder-width apart, kettlebell on the floor a foot in front of you.',
      'Hinge at the hips to grip the kettlebell with both hands.',
      'Hike the kettlebell back between your legs, then drive your hips forward explosively to swing it to chest height.',
      'Let the kettlebell fall back down and repeat the hip hinge.',
    ],
    tips: [
      'The power comes from your hips, not your arms or shoulders.',
      'Keep your back flat throughout the movement.',
    ],
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    category: 'Chest',
    equipment: 'Bodyweight',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulder-width.',
      'Lower your body until your chest nearly touches the floor, keeping elbows at about 45 degrees.',
      'Push back up to the starting position, keeping your body in a straight line.',
    ],
    tips: [
      'Keep your core and glutes braced to avoid sagging hips.',
      'Fully extend your arms at the top without locking out aggressively.',
    ],
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    instructions: [
      'Sit or stand holding a dumbbell in each hand at shoulder height, palms facing forward.',
      'Press the dumbbells overhead until your arms are fully extended.',
      'Lower back down under control to shoulder height.',
    ],
    tips: [
      'Avoid arching your lower back excessively — brace your core.',
      'Keep the dumbbells slightly in front of your body at the top, not directly overhead behind your ears.',
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Back',
    equipment: 'Machine',
    instructions: [
      'Sit at a lat pulldown machine and grip the bar wider than shoulder-width.',
      'Lean back slightly and pull the bar down to your upper chest.',
      'Squeeze your shoulder blades together at the bottom, then let the bar rise back up under control.',
    ],
    tips: [
      'Avoid pulling with your arms only — focus on driving your elbows down.',
      'Don’t lean back excessively to use momentum.',
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'Legs',
    equipment: 'Machine',
    instructions: [
      'Sit in the leg press machine with feet shoulder-width apart on the platform.',
      'Release the safety catches and lower the platform until your knees reach about 90 degrees.',
      'Press through your feet to extend your legs without locking your knees.',
    ],
    tips: [
      'Keep your lower back flat against the pad throughout.',
      'Avoid letting your knees cave inward.',
      'A higher foot placement on the platform emphasizes the glutes and hamstrings; a lower placement emphasizes the quads.',
    ],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Legs',
    equipment: 'Barbell',
    instructions: [
      'Hold a barbell at hip height with feet hip-width apart.',
      'Keeping a slight bend in your knees, hinge at the hips and lower the bar along your legs.',
      'Go down until you feel a stretch in your hamstrings, then drive your hips forward to stand back up.',
    ],
    tips: [
      'Keep the bar close to your legs throughout.',
      'Keep your back flat — this is a hip-hinge, not a squat.',
    ],
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    category: 'Chest',
    equipment: 'Dumbbell',
    instructions: [
      'Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing in.',
      'With a slight bend in your elbows, lower the dumbbells out to your sides in an arc.',
      'Once you feel a stretch across your chest, reverse the motion to bring the dumbbells back together.',
    ],
    tips: [
      'Keep the slight elbow bend fixed throughout — don’t turn it into a press.',
      'Avoid going so low that it strains your shoulders.',
    ],
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'Core',
    equipment: 'Bodyweight',
    instructions: [
      'Sit on the floor with knees bent, leaning back slightly to engage your core, feet lifted or on the floor.',
      'Hold your hands together (or a weight) in front of your chest.',
      'Rotate your torso to tap the floor on one side, then the other, in a controlled twisting motion.',
    ],
    tips: [
      'Move from your torso, not just your arms.',
      'Keep your chest up rather than rounding your back.',
    ],
  },
  {
    id: 'running',
    name: 'Running',
    category: 'Cardio',
    equipment: 'Bodyweight',
    instructions: [
      'Warm up with 5 minutes of brisk walking or light jogging.',
      'Maintain a steady pace with a relaxed upper body and midfoot strike.',
      'Cool down with a few minutes of walking after finishing.',
    ],
    tips: [
      'Breathe rhythmically and keep your shoulders relaxed, not hunched.',
      'Increase distance or pace gradually to avoid overuse injuries.',
    ],
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Full Body',
    equipment: 'Bodyweight',
    instructions: [
      'Start standing, then squat down and place your hands on the floor.',
      'Kick your feet back into a plank position and perform a push-up (optional).',
      'Jump your feet back up to your hands, then explosively jump up with arms overhead.',
    ],
    tips: [
      'Land softly with bent knees to reduce impact.',
      'Scale the intensity by removing the push-up or the jump as needed.',
    ],
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'Legs',
    equipment: 'Dumbbell',
    instructions: [
      'Hold a dumbbell vertically against your chest with both hands.',
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Squat down between your legs, keeping your chest up and elbows brushing your knees.',
      'Drive through your feet to stand back up.',
    ],
    tips: [
      'Keep the weight close to your chest throughout.',
      'Sit back and down rather than leaning forward.',
    ],
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    category: 'Shoulders',
    equipment: 'Cable',
    instructions: [
      'Set a cable to upper-chest height with a rope attachment.',
      'Grip the rope with both hands, palms facing in, and step back to create tension.',
      'Pull the rope toward your face, flaring your elbows out and squeezing your shoulder blades together.',
      'Return to the start under control.',
    ],
    tips: [
      'Focus on external rotation at the end of the pull for rear-delt and rotator cuff engagement.',
      'Use a lighter weight and prioritize form over load.',
    ],
  },
  {
    id: 'farmers-carry',
    name: 'Farmer’s Carry',
    category: 'Full Body',
    equipment: 'Dumbbell',
    instructions: [
      'Hold a heavy dumbbell or kettlebell in each hand at your sides.',
      'Stand tall with shoulders back and core braced.',
      'Walk forward for a set distance or time, keeping your steps controlled.',
    ],
    tips: [
      'Avoid leaning to one side — keep your torso upright.',
      'Grip the weights firmly rather than letting them swing.',
    ],
  },
  {
    id: 'recumbent-bike',
    name: 'Recumbent Bike',
    category: 'Cardio',
    equipment: 'Machine',
    instructions: [
      'Adjust the seat so your knee has a slight bend at the bottom of the pedal stroke.',
      'Set the resistance level and start pedaling at a steady, comfortable pace.',
      'Keep your back against the seat back throughout — the reclined position supports your lower back.',
    ],
    tips: [
      'Use a low-to-moderate resistance for warm-ups; save higher resistance for dedicated cardio sessions.',
      'The reclined seat makes this a good low-impact option for sensitive knees or backs.',
    ],
  },
  {
    id: 'seated-row-machine',
    name: 'Seated Row (Machine)',
    category: 'Back',
    equipment: 'Machine',
    instructions: [
      'Sit at the machine with feet on the platform and knees slightly bent, chest against the pad if provided.',
      'Grip the handles with arms extended toward the weight stack.',
      'Pull the handles toward your torso, squeezing your shoulder blades together.',
      'Extend your arms back out under control without rounding your back.',
    ],
    tips: [
      'Keep your torso upright — avoid rocking back and forth to move the weight.',
      'Lead the pull with your elbows, not your hands.',
    ],
  },
  {
    id: 'chest-press-machine',
    name: 'Chest Press Machine',
    category: 'Chest',
    equipment: 'Machine',
    instructions: [
      'Adjust the seat so the handles line up with the middle of your chest.',
      'Grip the handles and press them forward until your arms are extended without locking your elbows.',
      'Return to the starting position under control, letting your elbows travel back behind your torso.',
    ],
    tips: [
      'Keep your shoulder blades pulled back and down against the seat throughout the press.',
      'Avoid flaring your elbows up toward your ears.',
    ],
  },
  {
    id: 'cable-bicep-curl',
    name: 'Cable Bicep Curl',
    category: 'Arms',
    equipment: 'Cable',
    instructions: [
      'Stand facing a low cable pulley with a straight or EZ-curl bar attached.',
      'Grip the bar with palms facing up, elbows at your sides.',
      'Curl the bar up toward your shoulders without moving your elbows forward.',
      'Lower back down under control to full arm extension.',
    ],
    tips: [
      'The constant tension of the cable keeps your biceps loaded through the full range of motion.',
      'Avoid swinging your torso to generate momentum.',
    ],
  },
  {
    id: 'hip-abductor-machine',
    name: 'Hip Abductor Machine',
    category: 'Legs',
    equipment: 'Machine',
    instructions: [
      'Sit in the machine with the outside of your thighs against the pads, knees together.',
      'Push your legs outward against the resistance in a controlled motion.',
      'Return to the starting position under control without letting the weight stack slam down.',
    ],
    tips: [
      'Machine resistance often feels lighter than the marked weight — start conservatively.',
      'Keep your back flat against the seat rather than arching to generate extra force.',
    ],
  },
  {
    id: 'hip-adductor-machine',
    name: 'Hip Adductor Machine',
    category: 'Legs',
    equipment: 'Machine',
    instructions: [
      'Sit in the machine with the inside of your thighs against the pads, legs spread apart.',
      'Squeeze your legs together against the resistance in a controlled motion.',
      'Return to the starting position under control without letting the weight stack slam down.',
    ],
    tips: [
      'Machine resistance often feels lighter than the marked weight — start conservatively.',
      'Move through a comfortable range of motion rather than forcing a full stretch.',
    ],
  },
]
