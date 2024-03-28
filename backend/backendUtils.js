import path from 'path';
import fsSync from 'fs';
const fs = {
  ...fsSync.promises,
  existsSync: fsSync.existsSync,
};

export function getPath(...pathSegments) {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  return path.join(homeDir, ...pathSegments);
}

export async function getFileInfo(filePath) {
  const fullPath = getPath(filePath);
  const fileStats = await fs.stat(fullPath);

  return {
    size: fileStats.size,
    filetype: path.extname(filePath).slice(1),
  };
}