import prexit from "prexit";
import fs from "node:fs/promises";

class Gear {
  private readonly inner: number;
  private readonly outer: number;

  public gearNumber: number;
  public rotationFullCount: number;
  public rotationStepCount: number;
  public rotatedFully: boolean;
  public previous: Gear | null;

  constructor(previous: Gear | null, gearNumber: number) {
    this.inner = 10;
    this.outer = 100;

    this.gearNumber = gearNumber;
    this.rotatedFully = false;
    this.rotationFullCount = 0;
    this.rotationStepCount = 0;
    this.previous = previous;
  }

  rotate() {
    if (this.previous === null) {
      this.rotationStepCount += 1;
      this.rotatedFully = false;
    }

    if (this.previous && this.previous.rotatedFully) {
      this.rotationStepCount += 1;
      this.previous.rotatedFully = false;
      this.rotatedFully = false;
    }

    // if reached full rotation
    if (this.rotationStepCount === this.outer) {
      this.rotatedFully = true;
      this.rotationFullCount += 1;
      this.rotationStepCount = 0;
    }
  }

  state() {
    return {
      rotationFullCount: this.rotationFullCount,
      rotationStepCount: this.rotationStepCount,
    };
  }
}

function createGoogol(
  snapshot: { rotationFullCount: number; rotationStepCount: number }[] = [],
) {
  const gearsCount = 100;

  const googol: Gear[] = [];

  for (let i = 0; i < gearsCount; i++) {
    if (i === 0) {
      googol.push(new Gear(null, i + 1));
      continue;
    }

    googol.push(new Gear(googol[i - 1], i + 1));
  }

  if (snapshot.length > 0) {
    snapshot.forEach((gear, i) => {
      googol[i].rotationFullCount = gear.rotationFullCount;
      googol[i].rotationStepCount = gear.rotationStepCount;
    });
  }

  return googol;
}

function printCurrentState(googol: Gear[]) {
  console.clear();

  const data = [];

  for (const gear of googol) {
    if (gear.rotationFullCount > 0) {
      data.push({
        rotationFullCount: gear.rotationFullCount,
        rotationStepCount: gear.rotationStepCount,
      });
    }
  }

  if (data.length === 0) {
    return console.log("No gear has fully rotated yet.");
  }

  return console.table(data);
}

async function saveSnapshot(googol: Gear[]) {
  const data = googol.map((gear) => gear.state());
  const filePath = "./snapshot.json";

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function loadSnapshot() {
  try {
    const filePath = "./snapshot.json";
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as {
      rotationFullCount: number;
      rotationStepCount: number;
    }[];
    // eslint-disable-next-line
  } catch (_) {
    return [];
  }
}

function printFinalState(googol: Gear[]) {
  const data = googol.map((gear) => gear.state());
  console.table(data);
}

async function main() {
  const snapshot = await loadSnapshot();
  const googol = createGoogol(snapshot);
  // eslint-disable-next-line
  let interval: NodeJS.Timeout;

  prexit(async () => {
    clearInterval(interval);
    await saveSnapshot(googol);

    console.clear();
    console.log("\n");
    console.timeEnd("googol");

    printFinalState(googol);
  });

  console.time("googol");

  interval = setInterval(() => {
    googol.forEach((gear) => {
      gear.rotate();
    });

    printCurrentState(googol);
  }, 10);
}

await main();
