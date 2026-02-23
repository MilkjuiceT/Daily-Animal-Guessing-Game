// Colin Totten — 2/22/2025 
// UI layer: builds the game board, updates sliders, and renders the results popup

// Builds the full game UI — sliders, continent buttons, and submit button
function buildGame(animal) {
  const game = document.getElementById("game");

  let slidersHTML = "";
  STATS.forEach(stat => {
    const mid = Math.round((stat.min + stat.max) / 2);
    const pct = ((mid - stat.min) / (stat.max - stat.min)) * 100;
    slidersHTML += `
      <div class="stat-row">
        <div class="stat-header">
          <label for="${stat.key}">${stat.label}</label>
          <div class="slider-value" id="${stat.key}-val">${formatLabel(mid)}</div>
        </div>
        <input type="range" id="${stat.key}" min="${stat.min}" max="${stat.max}" value="${mid}"
          style="--val: ${pct}%" oninput="updateSlider(this, '${stat.key}-val', ${stat.min}, ${stat.max})" />
        <div class="slider-labels">
          <span>${formatLabel(stat.min)}</span>
          <span>${formatLabel(stat.max)}</span>
        </div>
      </div>`;
  });

  const continentsHTML = CONTINENTS.map(c => `
    <label class="continent-btn">
      <input type="checkbox" value="${c}" />
      <span>${c}</span>
    </label>`).join("");

  game.innerHTML = `
    <div class="game-header">
      <p class="game-pretitle">Today's animal is...</p>
      <h2 class="game-animal-name">${animal.name}</h2>
    </div>
    <div id="sliders">${slidersHTML}</div>
    <div class="stat-row location-section">
      <div class="stat-header"><label>Where is it found?</label></div>
      <div class="continent-grid">${continentsHTML}</div>
    </div>
    <button id="submit-btn" onclick="submitGuess()">Submit</button>
  `;
}

// Updates the slider fill and displayed value as the user drags
function updateSlider(input, valId, min, max) {
  const pct = ((input.value - min) / (max - min)) * 100;
  input.style.setProperty("--val", pct + "%");
  document.getElementById(valId).textContent = formatLabel(Number(input.value));
}

// Formats large numbers into readable labels: 2500000 → 2.5M, 45000 → 45k
function formatLabel(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 10_000)    return (value / 1_000).toFixed(0) + "k";
  if (value >= 1_000)     return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return Number(value).toLocaleString();
}

// Creates and appends the results popup overlay after the user submits
function showResults(totalPoints, maxPossible, breakdownHTML) {
  const existing = document.getElementById("results-overlay");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "results-overlay";
  overlay.innerHTML = `
    <div id="results-modal">
      <h3>Your score is...</h3>
      <div class="score-display">
        <span class="score-number">${totalPoints}</span>
        <span class="score-denom">/ ${maxPossible} points</span>
      </div>
      <div class="result-breakdown">
        <div class="result-header">
          <span>Category</span>
          <span>Your Guess</span>
          <span>Answer</span>
          <span>Points</span>
        </div>
        ${breakdownHTML}
      </div>
      <button onclick="playAgain()" class="play-again-btn">Play Again</button>
    </div>`;
  document.body.appendChild(overlay);
}

// Disables all sliders and continent buttons after submission
function lockInputs() {
  document.getElementById("submit-btn").disabled = true;
  STATS.forEach(stat => { const el = document.getElementById(stat.key); if (el) el.disabled = true; });
  document.querySelectorAll(".continent-btn input").forEach(el => el.disabled = true);
}