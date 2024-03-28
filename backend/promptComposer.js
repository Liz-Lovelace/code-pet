import fs from 'fs/promises';
import { getPath } from './backendUtils.js';

const headerTemplate = `# Task
{{prompt}}

# Files
`;

const fileTemplate = `{{filePath}}
\`\`\`
{{fileContents}}
\`\`\`

`;

export async function composePrompt(projectTree, prompt) {
  let composedPrompt = headerTemplate.replace('{{prompt}}', prompt);

  async function processTree(tree) {
    for (const item of tree) {
      if (item.type === 'file' && item.include) {
        const fileContents = await fs.readFile(getPath(item.path), 'utf-8');
        composedPrompt += fileTemplate
          .replace('{{filePath}}', item.path)
          .replace('{{fileContents}}', fileContents);
      }
      else if (item.type === 'dir') {
        await processTree(item.children);
      }
    }
  }

  await processTree(projectTree);
  return composedPrompt;
}