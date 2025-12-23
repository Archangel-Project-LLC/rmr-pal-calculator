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
  const goal = document.getElementById('goal').value;
  const rate = Number(document.getElementById('rate').value);

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

  // Goal-based adjustment (rate as % bodyweight/week)
  let targetCalories = total;
  let goalText = 'Maintenance calories (estimated): ' +
                 Math.round(total) + ' kcal/day';

  if (goal && rate > 0 && weight > 0) {
    const weeklyChangeKg = (rate / 100) * weight;
    const weeklyKcal = weeklyChangeKg * 7700; // rough kcal per kg
    const dailyKcal = weeklyKcal / 7;

    if (goal === 'loss') {
      targetCalories = total - dailyKcal;
      goalText = 'Fat loss target: about ' + Math.round(targetCalories) +
                 ' kcal/day for ~' + rate + '% bodyweight loss/week';
    } else if (goal === 'gain') {
      targetCalories = total + dailyKcal;
      goalText = 'Gain target: about ' + Math.round(targetCalories) +
                 ' kcal/day for ~' + rate + '% bodyweight gain/week';
    } else {
      goalText = 'Maintenance target: about ' + Math.round(total) +
                 ' kcal/day (no planned weight change)';
    }
  }

  // Simple macros from targetCalories
  const proteinPerKg = 2.0;
  const fatPerKg = 0.8;

  const protein = proteinPerKg * weight;
  const fat = fatPerKg * weight;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbsKcal = Math.max(targetCalories - proteinKcal - fatKcal, 0);
  const carbs = carbsKcal / 4;

  document.getElementById('results').innerText =
    'RMR: ' + Math.round(rmr) + ' kcal/day\n' +
    'PAL (steps-based): ' + pal.toFixed(2) + '\n' +
    'Non-exercise calories: ' + Math.round(nonExercise) + ' kcal/day\n' +
    'Training adjustment: ' + Math.round(trainingPerDay) + ' kcal/day\n' +
    'Total daily calories (TDEE): ' + Math.round(total) + ' kcal/day\n\n' +
    goalText + '\n' +
    'Suggested macros (per day):\n' +
    '- Protein: ' + Math.round(protein) + ' g\n' +
    '- Fat: ' + Math.round(fat) + ' g\n' +
    '- Carbs: ' + Math.round(carbs) + ' g';
}
