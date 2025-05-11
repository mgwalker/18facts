import fs from "node:fs/promises";

const FACT_URL_PREFIX =
  "https://raw.githubusercontent.com/team18f/facts/refs/heads/main/";

const factFiles = [
  { name: "Alan fact", file: "alan.json" },
  { name: "Capybara fact", file: "capybaras.json" },
  { name: "Dinosaur Fact", file: "dinosaurs.json" },
  { name: "Dolphin fact", file: "dolphins.json" },
  { name: "Ed Simulator", file: "ed.json" },
  { name: "Giraffe fact", file: "giraffes.json" },
  { name: "Hyrax fact", file: "hyraxes.json" },
  { name: "Minnesota fact", file: "minnesota.json" },
  { name: "National Park fact", file: "nps.json" },
  { name: "US President fact", file: "presidents.json" },
  { name: "Trivia", file: "trivia.json" },
  { name: "US Post Office fact", file: "usps.json" },
  { name: "Wisconsin fact", file: "wisconsin.json" },
];

const exists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const shuffle = async () => {
  if (!(await exists("shuffled.json"))) {
    const nested = await Promise.all(
      factFiles.map(async ({ name, file }) => {
        const url = `${FACT_URL_PREFIX}${file}`;
        const facts = await fetch(url).then((r) => r.json());

        return facts.map((fact) => ({ name, fact }));
      }),
    );

    const facts = nested.flat();

    for (let i = facts.length - 1; i > 0; i -= 1) {
      const j = Math.round(Math.random() * i);
      const tmp = facts[i];
      facts[i] = facts[j];
      facts[j] = tmp;
    }

    await fs.writeFile("shuffled.json", JSON.stringify(facts, null, 2));
  }
};

if (process.argv[1] === import.meta.filename) {
  shuffle();
}

export default shuffle;
