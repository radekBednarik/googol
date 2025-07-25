import prexit from 'prexit'

class Gear {
  private readonly inner: number;
  private readonly outer: number;
  private readonly ratio: number;

  public gearNumber: number;
  public rotationFullCount: number;
  public rotationStepCount: number;
  public rotatedFully: boolean;
  public previous: Gear | null;

  constructor(previous: Gear | null, gearNumber: number) {
    this.inner = 10;
    this.outer = 100;
    this.ratio = this.outer / this.inner;

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
    console.log("Gear no.: ", this.gearNumber);
    console.log("  -- full rotation count: ", this.rotationFullCount)
    console.log("  -- step rotation count: ", this.rotationStepCount)
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

async function main() {
  
  const googol = createGoogol();

  prexit(() => {
    googol.forEach((gear) => {
     gear.state()
   })     
  })

  while (true) {
    googol.forEach((gear) => {
      gear.rotate();
    });

    await new Promise((res) => setTimeout(res, 100));
  }
}

await main();
