// Colin Totten — 2/22/2025 
// Shared constants: stat definitions, scale tiers, continents, and point limits

const CSV_URL = "./assets/animals.csv";

// Slider scale tiers — game picks the smallest tier that fits today's animal's value
const STATS = [
  {
    key: "weight",
    label: "Weight - Max (lbs)",
    tiers: [
      { min: 0, max: 50     },
      { min: 0, max: 500    },
      { min: 0, max: 2000   },
      { min: 0, max: 15000  },
      { min: 0, max: 500000 },
    ]
  },
  {
    key: "height",
    label: "Height - Max (ft & in)",
    tiers: [
      { min: 0, max: 20  },
      { min: 0, max: 60  },
      { min: 0, max: 120 },
      { min: 0, max: 300 },
    ]
  },
  {
    key: "lifespan",
    label: "Lifespan - Max (years)",
    tiers: [
      { min: 0, max: 100  },
      { min: 0, max: 200  },
      { min: 0, max: 1000 },
      { min: 0, max: 10000 },
    ]
  },
  {
    key: "population",
    label: "Population",
    tiers: [
      { min: 0, max: 1_000       },
      { min: 0, max: 10_000      },
      { min: 0, max: 100_000     },
      { min: 0, max: 1_000_000   },
      { min: 0, max: 15_000_000  },
      { min: 0, max: 500_000_000 },
    ]
  },
];

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"];

const MAX_POINTS_PER_STAT = 100;
const MAX_LOCATION_POINTS = 100;