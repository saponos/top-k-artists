import 'dotenv/config';
import { readdirSync } from "fs";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workerFile = process.env.NODE_ENV === "production" ? "worker.js" : "worker.ts";
const workerPath = join(__dirname, workerFile);
const dataDir = join(__dirname, "..", "data");

async function main(pathToData: string) {
  const files = readdirSync(pathToData)
    .filter((file) => file.endsWith(".json.gz"));

  const result = await Promise.all(files.map(async (file) => 
    new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: { file }
      });
      worker.on("message", resolve);
      worker.on("error", reject);
    })
  ));

  console.log("Result from workers:", result);
}

main(dataDir)
  .catch((err) => console.error(err));
