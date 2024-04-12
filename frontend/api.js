import { sortProjectTree, sleep } from './frontendUtils.js';
import { store } from './store.js';

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
  const initResponse = await fetch(`${backendURL}/generate-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectTree, prompt }),
  }).then(res => res.json());

  if (initResponse.status !== 'ok') {
    throw 'Something went wrong with initializing codegen'
  }

  store.generatedCode.status = 'codegen initialized'
  while (store.generatedCode.status !== 'done') {
    store.generatedCode = await fetch(`${backendURL}/generated-code`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
    await sleep(100);
  }
}

async function generateDiff(projectTree, generatedCode) {
  const response = await fetch(`${backendURL}/generate-diff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectTree, generatedCode }),
  }).then(res => res.json());

  return response;
}

export default { getProjectList, getProjectTree, generateCode, generateDiff: generateDiff };