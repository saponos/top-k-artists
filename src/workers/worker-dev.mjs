import { register } from "tsx/esm/api";

const unregister = register();

try {
  await import("./worker.ts");
} finally {
  if (typeof unregister === "function") {
    await unregister();
  }
}

