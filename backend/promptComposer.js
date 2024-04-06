import fs from 'fs/promises';
import { getPath } from './backendUtils.js';

export async function composeCodegenPrompt(projectTree, task) {
  const fileItems = await getFileItems(projectTree);

  let prompt = `# Task\n${task}\n\n`;
  prompt += drawFileTree(fileItems)
  prompt += drawFiles(fileItems)

  return prompt;
}

const integratorTask = `# Task
Your job is to integrate changes into code files. 

The required changes are described in the Instructions block, and the current state of the files is described in the Files block. 

To change a file, you have to specify its path, and the new contents it should be overwritten with. You only have to output files that need to be modified, added, or deleted. Here's how you should structure your output:

\`\`\`
<path>project-name/dir/fileA.txt</path>
<file>
old-line
new-line
old-line
</file>
\`\`\`

This will overwrite the contents of fileA.txt with the body of the <file> tag.

If you want to delete a file, you can do so by specifying it in a <deletepath> tag. Here's an example:

\`\`\`
<deletepath>project-name/trash.json</deletepath>
\`\`\`

You can even rename files! You do this by deleting it, and then writing its contents to a new file. Example:

\`\`\`
<deletepath>project-name/dir/fileA.txt</deletepath>
<path>project-name/dir/newFileName.md</path>
<file>
old-line
old-line
old-line
</file>
\`\`\`

Okay, now you're ready to integrate changes into code! Below is an Instructions block with all the changes that you need to make. If you see any instructions that you can't accomplish with the tools you're provided, like running console commands, you can ignore those instructions. You shouldn't explain anything you're doing, just output the tags and their contents.

`
export async function composeIntegrationPrompt(projectTree, generatedCode) {
  const fileItems = await getFileItems(projectTree);

  let prompt = integratorTask;
  prompt += `# Instructions\n${generatedCode}\n\n`
  prompt += drawFileTree(fileItems)
  prompt += drawFiles(fileItems)

  return prompt;
}

function drawFileTree(items) {
  let fileTree = `# File tree\n`;

  for (const item of items) {
    const indentation = '  '.repeat(item.depth);
    let name = item.name;
    if (item.type == 'dir') {
      name = `${name}/`;
    }
    fileTree += `${indentation}${name}\n`;
  }

  return fileTree + '\n';
}

const fileTemplate = `{{filePath}}
\`\`\`
{{fileContents}}
\`\`\`

`;

function drawFiles(items) {
  let fileBlock = `# files \n`
  for (const item of items) {
    if (item.type === 'file' && item.include) {
      fileBlock += fileTemplate
        .replace('{{filePath}}', item.path)
        .replace('{{fileContents}}', item.contents);
    }
  }
  return fileBlock
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