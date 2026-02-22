// =====================
// animal-fetcher Worker
// Fetches daily animal from API Ninjas, stores in KV, then deploys to game.
// Written by Colin Totten
// =====================

// List of mammals to cycle through daily
const MAMMALS = [
  "lion", "tiger", "elephant", "giraffe", "zebra",
  "cheetah", "gorilla", "hippopotamus", "rhinoceros", "leopard",
  "chimpanzee", "wolf", "bear", "moose", "bison",
  "kangaroo", "koala", "platypus", "panda", "snow leopard",
  "jaguar", "cougar", "lynx", "wolverine", "hyena",
  "warthog", "meerkat", "baboon", "mandrill", "orangutan",
  "polar bear", "grizzly bear", "black bear", "walrus", "seal",
  "dolphin", "orca", "blue whale", "humpback whale", "manatee"
];

export default {

  // Handles requests from games frontend
  async fetch(request, env, ctx) {

    // Allowas Pages site to call this Worker
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    };

    // Try to get today's animal from KV
    const cached = await env.DAILY_ANIMAL.get("today");

    if (cached) {
      return new Response(cached, { headers });
    }

    // Nothing in KV yet — fetch a fresh one
    const animal = await fetchAnimal(env);
    return new Response(JSON.stringify(animal), { headers });
  },

  // Runs every day at midnight PST (0 8 * * *)
  async scheduled(event, env, ctx) {
    await fetchAnimal(env);
  }

};

// Picks today's mammal and fetches it from API Ninjas
async function fetchAnimal(env) {

  // Pick mammal based on day of year so everyone gets the same one
  const day = Math.floor(Date.now() / 86400000);
  const name = MAMMALS[day % MAMMALS.length];

  // Call API Ninjas
  const response = await fetch(
    `https://api.api-ninjas.com/v1/animals?name=${name}`,
    { headers: { "X-Api-Key": env.API_NINJAS_KEY } }
  );

  const data = await response.json();
  const animal = data[0];

  // Pull out the stats we need for the sliders
  const result = {
    name: animal.name,
    stats: {
      lifespan: animal.characteristics.lifespan,
      weight: animal.characteristics.weight,
      top_speed: animal.characteristics.top_speed,
      height: animal.characteristics.height,
      litter_size: animal.characteristics.average_litter_size,
      gestation: animal.characteristics.gestation_period
    }
  };

  // Save to KV with 24 hour expiry
  await env.DAILY_ANIMAL.put("today", JSON.stringify(result), {
    expirationTtl: 86400
  });

  return result;
}