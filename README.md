# Top-K Artists in Archive

Analyze large collections of compressed JSONL music logs and surface the most
frequently appearing artists. The project demonstrates how to parallelize
workloads with Node.js worker threads while keeping local development fast and
interactive.

## Highlights
- Streams `.jsonl.gz` archives line-by-line to avoid loading whole files in memory
- Aggregates counts across multiple files in parallel worker threads
- Supports interactive dataset sizing (`easy`, `medium`, `hard`) for local testing
- Ships with a data generator to create realistic sample archives

## Getting Started

### Prerequisites
- Node.js 20+
- `pnpm` 10.20.0 (matching the `packageManager` field)

### Installation
```bash
pnpm install
```

### Generate Sample Data
Create compressed JSONL datasets under the `data/` directory:
```bash
pnpm generate-data
```

The generator writes three difficulty levels (`easy`, `medium`, `hard`) with
increasing file sizes so you can benchmark the pipeline.

### Run the Analyzer
- Development (transpiled on the fly):
  ```bash
  pnpm dev
  ```
- Watch mode (auto-restart on changes):
  ```bash
  pnpm watch
  ```
- Production build:
  ```bash
  pnpm build
  pnpm start        # runs against compiled files in dist/
  ```

In production mode you will be prompted to choose the dataset difficulty before
processing begins. In development the `hard` dataset is used automatically.

## Configuration

Environment variables are loaded via `dotenv`. Supported variables:

| Name            | Default | Description                                 |
|-----------------|---------|---------------------------------------------|
| `TOP_K_ARTISTS` | `10`    | How many top artists to print after sorting |
| `NODE_ENV`      | —       | Use `production` to run the compiled build  |

You can place a `.env` file at the repository root to set these values.

## How It Works
1. `src/main.ts` discovers `.jsonl.gz` files for the chosen difficulty and spins
   up one worker per file.
2. Each worker (`src/worker.ts`) streams its file, counting artist occurrences
   via `countArtistAppearancesInFile`.
3. The main thread merges counts from all workers, sorts by total appearances,
   and prints the top `k`.

The development worker loader (`src/worker-dev.mjs`) registers `tsx` so TypeScript
worker code can run without a prior build.

## Project Structure
- `src/main.ts` – orchestrates worker execution and result aggregation
- `src/worker.ts` – worker thread entry point
- `src/utils/count-artist-appearances.ts` – streaming counter implementation
- `src/utils/generate-data.ts` – sample dataset generator
- `src/utils/const.ts` – shared constants (artists, difficulty levels, config)

## License

ISC