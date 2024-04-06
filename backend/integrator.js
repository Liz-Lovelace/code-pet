import fs from 'fs/promises';
import { getPath } from './backendUtils.js';

export async function applyDiff(diffObject) {
  for (const item of diffObject) {
    try {
      const filePath = getPath(item.path);

      if (item.action === 'write') {
        await fs.writeFile(filePath, item.body, 'utf8');
      } else if (item.action === 'delete') {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error writing/deleting file ${item.path}: ${error.message}`);
    }
  }
}

export function parseDiff(rawDiff) {
  try {
    const objects = extractTags(rawDiff);
    const groupedObjects = groupObjects(objects);
    return groupedObjects;
  } catch (error) {
    console.error(`Error parsing file: ${error.message}`);
    console.error(`Content:\n${rawDiff}`);
    throw error;
  }
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

function groupObjects(objects) {
  const groupedObjects = [];

  for (let i = 0; i < objects.length; i++) {
    const currentObject = objects[i];

    if (currentObject.tag === 'path') {
      if (i + 1 < objects.length && objects[i + 1].tag === 'file') {
        groupedObjects.push({
          action: 'write',
          path: currentObject.body,
          body: objects[i + 1].body + '\n',
        });
        i++;
      } else {
        throw new Error(`Missing <file> tag after <path> at index ${i}`);
      }
    } else if (currentObject.tag === 'deletepath') {
      groupedObjects.push({
        action: 'delete',
        path: currentObject.body,
      });
    } else {
      throw new Error(`Unexpected tag <${currentObject.tag}> at index ${i}`);
    }
  }

  return groupedObjects;
}

