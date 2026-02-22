// Colin Totten — 2/22/2025  
// Main orchestrator: initializes the game, handles submission, and tracks streaks

let todayAnimal = null;
let allAnimals = [];

// Loads data, picks today's animal, assigns scales, then builds the game board
window.addEventListener("DOMContentLoaded", async () => {
  const game = document.getElementById("game");
  try {
    allAnimals = await loadCSV();
    todayAnimal = getTodaysAnimal(allAnimals);
    assignScales(todayAnimal);
  } catch (err) {
    game.innerHTML = `<div class="already-played"><p>Could not load animal data. Please try again later.</p></div>`;
    console.error(err);
    return;
  }
  buildGame(todayAnimal);
});

// Picks a random animal that isn't the same as the current one, assigns its scales, and rebuilds the game
function playAgain() {
  const others = allAnimals.filter(a => a.name !== todayAnimal.name);
  todayAnimal = others[Math.floor(Math.random() * others.length)];
  assignScales(todayAnimal);
  // Remove results overlay
  const overlay = document.getElementById("results-overlay");
  if (overlay) overlay.remove();
  buildGame(todayAnimal);
}

// Scores all slider guesses and the location guess, then shows the results popup
function submitGuess() {
  let totalPoints = 0, maxPossible = 0, breakdownHTML = "";

  STATS.forEach(stat => {
    const guess  = parseFloat(document.getElementById(stat.key).value);
    const actual = parseFloat(todayAnimal[stat.key]);
    const points = calcSliderPoints(guess, actual, stat.min, stat.max);
    if (points === null) return;
    maxPossible += MAX_POINTS_PER_STAT;
    totalPoints += points;
    const quality = points >= 50 ? "correct-row" : points >= 20 ? "partial-row" : "incorrect-row";
    breakdownHTML += `
      <div class="result-row ${quality}">
        <span class="row-label">${stat.label}</span>
        <span class="row-guess">${formatValue(stat.key, guess)}</span>
        <span class="row-actual">${formatValue(stat.key, actual)}</span>
        <span class="points-badge">${points}</span>
      </div>`;
  });

  // Score the location question
  const selected = Array.from(document.querySelectorAll(".continent-btn input:checked")).map(el => el.value);
  const locationPoints = calcLocationPoints(selected, todayAnimal.locations);
  maxPossible += MAX_LOCATION_POINTS;
  totalPoints += locationPoints;
  const locQuality = locationPoints >= 50 ? "correct-row" : locationPoints >= 20 ? "partial-row" : "incorrect-row";
  breakdownHTML += `
    <div class="result-row ${locQuality}">
      <span class="row-label">Locations</span>
      <span class="row-guess">${selected.length ? selected.join(", ") : "None"}</span>
      <span class="row-actual">${todayAnimal.locations || "Unknown"}</span>
      <span class="points-badge">${locationPoints}</span>
    </div>`;

  updateStreak(Math.round((totalPoints / maxPossible) * 100) >= 70);
  showResults(totalPoints, maxPossible, breakdownHTML);
  lockInputs();
}

// Formats population values as 1.2M or 45k; other stats as plain numbers
function formatValue(key, value) {
  if (key === "population") {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000)     return (value / 1_000).toFixed(1) + "k";
  }
  return Number(value).toLocaleString();
}

// Tracks consecutive daily wins in localStorage
function updateStreak(won) {
  const lastPlayed = localStorage.getItem("streakLastPlayed");
  const yesterday  = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let streak = parseInt(localStorage.getItem("streak") || "0");
  streak = won ? (lastPlayed === yesterday.toDateString() ? streak + 1 : 1) : 0;
  localStorage.setItem("streak", streak);
  localStorage.setItem("streakLastPlayed", new Date().toDateString());
} 