// Colin Totten — 2/22/2025 
// Scoring logic: calculates points for sliders and location guesses

// Awards 0–100 pts based on distance from the correct answer as a % of the slider range
// 0–15% off: 100 down to 50 | 15–25% off: 50 down to 20 | 25%+ off: 20 down to 0
function calcSliderPoints(guess, actual, min, max) {
  if (isNaN(actual) || actual === 0) return null;
  const pctOff = Math.abs(guess - actual) / (max - min);

  if (pctOff <= 0.15) {
    return Math.round(100 - (pctOff / 0.15) * 50);
  } else if (pctOff <= 0.25) {
    return Math.round(50 - ((pctOff - 0.15) / 0.10) * 30);
  } else {
    return Math.round(20 - Math.min(1, (pctOff - 0.25) / 0.75) * 20);
  }
}

// Awards 0–100 pts based on correct continent picks minus wrong picks
function calcLocationPoints(selected, actual) {
  if (!actual) return 0;
  const actualList = actual.split(",").map(s => s.trim().toLowerCase());
  const selectedList = selected.map(s => s.toLowerCase());
  let correct = 0, wrong = 0;
  CONTINENTS.forEach(c => {
    const isActual   = actualList.includes(c.toLowerCase());
    const isSelected = selectedList.includes(c.toLowerCase());
    if (isActual && isSelected)  correct++;
    if (!isActual && isSelected) wrong++;
  });
  return Math.round((Math.max(0, correct - wrong) / actualList.length) * MAX_LOCATION_POINTS);
}