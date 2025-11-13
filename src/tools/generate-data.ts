import fs from "node:fs";
import fsp from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Level } from "../lib/types.js";
import { EASY, MEDIUM, HARD, ARTISTS } from "../lib/const.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataRoot = join(__dirname, "..", "..", "data");

const ARTISTS_LENGTH = ARTISTS.length;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickArtist = () => ARTISTS[Math.floor(Math.random() * ARTISTS_LENGTH)];

function linesGenerator(total: number): Readable {
  return Readable.from(
    (async function* () {
      for (let i = 0; i < total; i++) {
        yield JSON.stringify({ artist: pickArtist() }) + "\n";
      }
    })()
  );
}

async function generateGzipJsonl(
  outPath: string,
  total: number
): Promise<void> {
  await fsp.mkdir(join(outPath, ".."), { recursive: true });
  const src = linesGenerator(total);
  const gz = createGzip();
  const dest = fs.createWriteStream(outPath);
  await pipeline(src, gz, dest);
}

const levels: Level[] = [
  { name: EASY, range: [20, 100], files: 3 },
  { name: MEDIUM, range: [50_000, 100_000], files: 3 },
  { name: HARD, range: [1_000_000, 2_000_000], files: 3 },
];

async function run(): Promise<void> {
  await fsp.mkdir(dataRoot, { recursive: true });

  for (const {
    name,
    range: [min, max],
    files,
  } of levels) {
    const dir = join(dataRoot, name);
    await fsp.mkdir(dir, { recursive: true });

    for (let i = 1; i <= files; i++) {
      const count = randInt(min, max);
      const filename = `${name}-${i}.jsonl.gz`;
      const file = join(dir, filename);
      await generateGzipJsonl(file, count);
      console.log(`✅ Generated ${filename} with ${count} lines`);
    }
  }

  console.log("✅ All datasets generated under:", dataRoot);
}

run().catch((e) => {
  console.error("Generation failed:", e);
  process.exit(1);
});
