import { sortProjectTree } from './frontendUtils.js';

const backendURL = '/api';

async function getProjectList() {
  let response = await fetch(`${backendURL}/project-list`).then(res => res.json());
  response.sort();
  return response;
}

async function getProjectTree(projectName) {
  let response = await fetch(`${backendURL}/project-tree?project=${projectName}`).then(res => res.json());

  sortProjectTree(response);

  return response;
}

async function generateCode(projectTree, prompt) {
  const response = await fetch(`${backendURL}/generate-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectTree, prompt }),
  }).then(res => res.json());

  return response;
}

async function integrateCode(projectTree, generatedCode) {
  const response = await fetch(`${backendURL}/integrate-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectTree, generatedCode }),
  }).then(res => res.json());

  return response;
}

export default { getProjectList, getProjectTree, generateCode, integrateCode };