import { parentPort } from "node:worker_threads";


parentPort?.postMessage("Hello from worker");