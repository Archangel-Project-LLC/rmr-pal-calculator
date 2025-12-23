function getPalFromSteps(steps) {
  if (steps < 5000) return 1.25;      // mostly sedentary
  if (steps < 8000) return 1.4;       // low active
  if (steps < 10000) return 1.55;     // light-moderate
  if (steps < 15000) return 1.7;      // moderate
  return 1.9;                         // very active
}

function getTrainingKcalPerHour(intensity) {
  if (intensity === 'light') return 200;
  if (intensity === 'moderate') return 350;
  return 500; // hard
}

function calculate() {
  const sex = document.getElementById('sex').value;
  const age = Number(document.getElementById('age').value);
  const weight = Number(document.getElementById('weight').value);
  const height = Number(document.getElementById('height').value);
  const steps = Number(document.getElementById('steps').value);
  const sessions = Number(document.getElementById('sessions').value);
  const duration = Number(document.getElementById('duration').value);
  const intensity = document.getElementById('intensity').value;

  // RMR with Mifflin–St Jeor
  let rmr;
  if (sex === 'male') {
    rmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    rmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // PAL from steps
  const pal = getPalFromSteps(steps);
  const nonExercise = rmr * pal;

  // Training adjustment
  const kcalPerHour = getTrainingKcalPerHour(intensity);
  const trainingPerSession = (duration / 60) * kcalPerHour;
  const trainingPerDay = (sessions * trainingPerSession) / 7;

  const total = nonExercise + trainingPerDay;

  document.getElementById('results').innerText =
    'RMR: ' + Math.round(rmr) + ' kcal/day\n' +
    'PAL (steps-based): ' + pal.toFixed(2) + '\n' +
    'Non-exercise calories: ' + Math.round(nonExercise) + ' kcal/day\n' +
    'Training adjustment: ' + Math.round(trainingPerDay) + ' kcal/day\n' +
    'Total daily calories: ' + Math.round(total) + ' kcal/day';
}
