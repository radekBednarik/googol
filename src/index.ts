import prexit from "prexit";

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
    // if either this is first gear OR the previous one fully rotated
    // rotate one step
    if (this.previous === null || this.previous.rotatedFully) {
      this.rotationStepCount += 1;
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

function createGoogol() {
  const gearsCount = 100;

  const googol: Gear[] = [];

  for (let i = 0; i < gearsCount; i++) {
    if (i === 0) {
      googol.push(new Gear(null, i + 1));
      continue;
    }

    googol.push(new Gear(googol[i - 1], i + 1));
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

function printFinalState(googol: Gear[]) {
  const data = googol.map((gear) => gear.state());
  console.table(data);
}

function main() {
  const googol = createGoogol();
  // eslint-disable-next-line
  let interval: NodeJS.Timeout;

  prexit(() => {
    clearInterval(interval);

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
  }, 1000);
}

main();
