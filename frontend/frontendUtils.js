import { defaultIncludedFiletypes } from '../config.js';

export function sortProjectTree(projectTree) {
  projectTree.sort(treeSorter);
  for(let item of projectTree){
    if (item.type == 'dir'){
      sortProjectTree(item.children)
    }
  }
}

function treeSorter(a, b) {
  if ('dir' == a.type && 'dir' == b.type) {
    return a.children.length - b.children.length;
  }

  if (a.type == 'dir'){
    return 1;
  }

  if (b.type == 'dir'){
    return -1;
  }

  if (!a.include && !b.include) {
    return 0;
  }

  if (!a.include) {
    return 1
  }

  if (!b.include) {
    return -1
  }

  let ai = defaultIncludedFiletypes.indexOf(a.filetype)
  let bi = defaultIncludedFiletypes.indexOf(b.filetype)

  if (ai !== -1 && bi !== -1 && ai !== bi) {
    return ai - bi;
  }

  return b.size - a.size;
}