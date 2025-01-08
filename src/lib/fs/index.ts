import fs from "node:fs/promises";
import path from "node:path";

export async function getFilepaths(folder: string) {
  const files = await fs.readdir(folder, { recursive: true });
  const filepaths: string[] = [];

  const promises = files.map(async (file) => {
    const filepath = path.join(folder, file);
    const stat = await fs.stat(filepath);
    if (!stat.isDirectory()) filepaths.push(file);
  });

  await Promise.all(promises);
  return filepaths;
}
