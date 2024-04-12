import fs from 'fs/promises';
import { getPath } from './backendUtils.js';

export async function applyDiff(diff) {
  for (const delta of diff) {
    const filePath = getPath(delta.path);

    if (delta.newCode) {
      await fs.writeFile(filePath, delta.newCode, 'utf8');
    } else {
      await fs.unlink(filePath);
    }
  }
}

export async function parseDiff(rawDiff) {
  let tags = extractTags(rawDiff);
  let deltas = deltasFromTags(tags);
  deltas = await addOldCode(deltas);
  return deltas;
}

function extractTags(content) {
  const regex = /<(path|file|deletepath)>([\s\S]*?)<\/\1>/g;
  const matches = [...content.matchAll(regex)];

  const objects = matches.map(match => ({
    tag: match[1],
    body: match[2].trim(),
  }));

  return objects;
}

function deltasFromTags(tags) {
  const diff = [];

  for (let i = 0; i < tags.length; i++) {
    const currentTag = tags[i];

    if (currentTag.tag === 'path') {
      if (i + 1 < tags.length && tags[i + 1].tag === 'file') {
        diff.push({
          action: 'write',
          path: currentTag.body,
          newCode: tags[i + 1].body + '\n',
        });
        i++;
      } else {
        throw new Error(`Missing <file> tag after <path> at index ${i}`);
      }
    } else if (currentTag.tag === 'deletepath') {
      diff.push({
        action: 'delete',
        path: currentTag.body,
        newCode: '',
      });
    } else {
      throw new Error(`Unexpected tag <${currentTag.tag}> at index ${i}`);
    }
  }

  return diff;
}

async function addOldCode(diff) {
  diff = diff.map( async delta => ({
    ...delta,
    oldCode: await fs.readFile(getPath(delta.path), 'utf-8'),
  }));

  return Promise.all(diff)
}