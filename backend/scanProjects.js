import fsSync from 'fs';
const fs = {
  ...fsSync.promises,
  existsSync: fsSync.existsSync,
}
import path from 'path';
import ignore from 'ignore';
import { getPath } from './backendUtils.js';
import { enrichProjectTree } from './enrichProject.js'

export async function getProjectList() {
  const subdirs = await fs.readdir(getPath('/'), { withFileTypes: true });
  const gitDirs = subdirs.filter(dirent => dirent.isDirectory() && fs.existsSync(getPath(dirent.name, '.git')));

  return gitDirs.map(dir => dir.name);
}

async function getFileTree(dirPath, ig) {
  const entries = await fs.readdir(getPath(dirPath), { withFileTypes: true });
  const fileTree = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(dirPath, entryPath);

    if (shouldFileBeIgnored(relativePath, ig)) {
      continue;
    }

    if (entry.isDirectory()) {
      fileTree.push({
        name: entry.name,
        type: 'dir',
        children: await getFileTree(entryPath, ig),
        path: path.join(dirPath, entry.name),
      });
    } else {
      fileTree.push({
        name: entry.name,
        type: 'file',
        path: path.join(dirPath, entry.name),
      });
    }
  }

  return fileTree;
}

function shouldFileBeIgnored(filePath, ig) {
  const defaultIgnoredItems = ['.git', 'node_modules', '.DS_Store'];

  if (defaultIgnoredItems.includes(filePath)) {
    return true;
  }

  if (ig.ignores(filePath)){
    return true;
  }

  return false;
}

export async function getProjectTree(dirPath) {
  let ig = ignore();
  const gitIgnorePath = getPath(dirPath, '.gitignore')
  if (fs.existsSync(gitIgnorePath)) {
    const gitignoreContent = await fs.readFile(gitIgnorePath, 'utf8');
    ig = ignore().add(gitignoreContent);
  }

  let project = await getFileTree(dirPath, ig)
  return enrichProjectTree(project)
}