import type { CodeChunk, PrFile } from "@/features/reviews/types/review";

/** code chunk will contain 80 code line */
const MAX_CHUNK_LINES = 80;

/** e.g. `pr-42--src/foo.ts--part-0` */
function buildChunkId(prNumber: number, filePath: string, part: number) {
  return `pr-${prNumber}--${filePath}--part-${part}`;
}

export function chunkPrFiles(prNumber: number, files: PrFile[]): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const file of files) {
    const lines = file.patch.split("\n");

    // Slide a fixed-size window across the diff; large files produce many chunks
    for (let start = 0; start < lines.length; start += MAX_CHUNK_LINES) {
      const part = start / MAX_CHUNK_LINES;
      const text = lines.slice(start, start + MAX_CHUNK_LINES).join("\n");

      chunks.push({
        id: buildChunkId(prNumber, file.filePath, part),
        filePath: file.filePath,
        text,
      });
    }
  }

  return chunks;
}
