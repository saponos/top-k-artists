import { parentPort, workerData } from "node:worker_threads";
import { countArtistAppearancesInFile } from "./utils/count-artist-appearances.js";

parentPort?.postMessage({
  data: await countArtistAppearancesInFile(workerData),
});
process.on("uncaughtException", (err) => {
  parentPort?.postMessage({ error: err.message });
  process.exit(1);
});
