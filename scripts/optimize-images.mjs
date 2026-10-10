import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const photosDirectory = fileURLToPath(new URL("../src/assets/photos/", import.meta.url));
const sourceFiles = (await readdir(photosDirectory)).filter(
  (file) => extname(file).toLowerCase() === ".jpg",
);

for (const sourceFile of sourceFiles) {
  const source = join(photosDirectory, sourceFile);
  const destination = join(photosDirectory, `${basename(sourceFile, ".jpg")}.webp`);

  await sharp(source)
    .rotate()
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(destination);
}

console.log(`Optimized ${sourceFiles.length} photos to WebP.`);
