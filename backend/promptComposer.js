import fs from 'fs/promises';
import { getPath } from './backendUtils.js';

const headerTemplate = `# Task
{{prompt}}

# File tree
{{fileTree}}

# Files
`;

const fileTemplate = `{{filePath}}
\`\`\`
{{fileContents}}
\`\`\`

`;


export async function composePrompt(projectName, projectTree, prompt) {
  const fileItems = await getFileItems(projectTree);
  const fileTree = getFileTree(projectName, fileItems);

  let composedPrompt = headerTemplate
    .replace('{{prompt}}', prompt)
    .replace('{{fileTree}}', fileTree);

  for (const item of fileItems) {
    if (item.type === 'file' && item.include) {
      composedPrompt += fileTemplate
        .replace('{{filePath}}', item.path)
        .replace('{{fileContents}}', item.contents);
    }
  }

  composedPrompt = prepareForClaudeWorkbench(composedPrompt);
  return composedPrompt;
}

function getFileTree(projectName, items) {
  let fileTree = `${projectName}/\n`;

  for (const item of items) {
    const indentation = '  '.repeat(item.depth + 1);
    let name = item.name;
    if (item.type == 'dir') {
      name = `${name}/`;
    }
    fileTree += `${indentation}${name}\n`;
  }

  return fileTree;
}

async function getFileItems(tree, depth = 0) {
  const items = [];

  for (const item of tree) {
    const itemWithDepth = { ...item, depth };

    if (item.type === 'file') {
      const fileContents = item.include ? await fs.readFile(getPath(item.path), 'utf-8') : null;
      items.push({ ...itemWithDepth, contents: fileContents });
    }
    else if (item.type === 'dir') {
      const childItems = await getFileItems(item.children, depth + 1);
      items.push(itemWithDepth, ...childItems);
    }
  }

  return items;
}


function prepareForClaudeWorkbench(prompt) {
  return prompt.replaceAll('\n\n', '\n \n');
}