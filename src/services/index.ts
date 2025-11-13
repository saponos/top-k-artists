import { readdirSync } from "fs";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type {
  ArtistAppearanceMap,
  CompareFunction,
  GetKeyFunction,
} from "../lib/types.js";
import { HARD, TOP_K_ARTISTS } from "../lib/const.js";
import { selectDifficulty } from "../tools/select-difficulty.js";
import { MinHeap } from "../model/min-heap.js";
import { ArtistAppearance, WorkerMessage } from "../lib/interfaces.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
const workerFile = isProduction ? "../workers/worker.js" : "../workers/worker-dev.mjs";
const workerUrl = new URL(workerFile, import.meta.url);
const workerExecArgv = isProduction ? undefined : [...process.execArgv];

const artistAppearances: ArtistAppearanceMap = new Map();
const compareAppearances: CompareFunction<ArtistAppearance> = (a, b) =>
  a.appearances - b.appearances;
const getKey: GetKeyFunction<ArtistAppearance> = ({ artist }) => artist;
const heap = new MinHeap<ArtistAppearance>(
  TOP_K_ARTISTS,
  compareAppearances,
  getKey
);

async function processFileWithWorker(path: string): Promise<void> {
  const worker = new Worker(workerUrl, {
    workerData: path,
    ...(workerExecArgv ? { execArgv: workerExecArgv } : {}),
  });

  await new Promise<void>((resolve, reject) => {
    worker.on("message", (message: WorkerMessage) => {
      if ("error" in message) return reject(new Error(message.error));
      const chunk: ArtistAppearanceMap = message.data ?? new Map();

      for (const [artist, appearances] of chunk) {
        const total = (artistAppearances.get(artist) || 0) + appearances;
        artistAppearances.set(artist, total);
        heap.push({ artist, appearances: total });
      }
    });

    worker.on("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code}`));
        return;
      }

      resolve();
    });
  });
}


export default async function main(): Promise<ArtistAppearance[]> {
  const difficulty = isProduction ? await selectDifficulty() : HARD;
  const dataDir = join(__dirname, "..", "..", "data", difficulty);
  const files = readdirSync(dataDir).filter((file) =>
    file.endsWith(".jsonl.gz")
  );

  await Promise.all(files.map((file) => processFileWithWorker(join(dataDir, file))));
  return heap.toArray().sort((a, b) => b.appearances - a.appearances);
}