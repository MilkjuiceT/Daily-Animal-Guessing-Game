// Colin Totten — 2/22/2025 
// Data layer: loads the CSV, parses it, picks today's animal, and assigns slider scales

const CSV_URL_REF = CSV_URL;

// Fetches and parses animals.csv into an array of objects
async function loadCSV() {
  const response = await fetch(CSV_URL);
  const text = await response.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] ? cols[i].trim() : ""; });
    return obj;
  });
}

// Handles quoted fields like "Africa,Asia" without splitting on the inner comma
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { result.push(current); current = ""; }
    else { current += char; }
  }
  result.push(current);
  return result;
}

// Uses a date-based seed so every user gets the same animal on the same day
function getTodaysAnimal(animals) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = Math.abs(Math.sin(seed) * 9999);
  return animals[Math.floor(rand % animals.length)];
}

// Sets min/max on each stat by picking the smallest tier that fits today's animal's value
function assignScales(animal) {
  STATS.forEach(stat => {
    const value = parseFloat(animal[stat.key]);
    const tier = stat.tiers.find(t => value <= t.max) || stat.tiers[stat.tiers.length - 1];
    stat.min = tier.min;
    stat.max = tier.max;
  });
}