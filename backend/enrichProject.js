import { getFileInfo } from './backendUtils.js';

export async function enrichProjectTree(project) {
  for (let item of project) {
    if (item.type === 'file') {
      const info = await getFileInfo(item.path);
      let updatedItem = {
        ...item,
        size: info.size,
        filetype: info.filetype,
        include: false,
      };
      Object.assign(item, updatedItem);
    }
    else if (item.type === 'dir') {
      item.children = await enrichProjectTree(item.children);
    }
  }
  return project;
}