import { sortProjectTree } from './frontendUtils.js';

const backendURL = 'http://localhost:10101'

async function getProjectList() {
  let response = await fetch(`${backendURL}/project-list`).then(res => res.json());
  response.sort()
  return response;
}

async function getProjectTree(projectName) {
  let response = await fetch(`${backendURL}/project-tree?project=${projectName}`).then(res => res.json());
  sortProjectTree(response)
  return response;
}

async function composePrompt(projectTree, prompt) {
  const response = await fetch(`${backendURL}/compose-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectTree, prompt }),
  });
  return response.text();
}

export default { getProjectList, getProjectTree, composePrompt };