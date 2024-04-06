import { sortProjectTree } from './frontendUtils.js';
import axios from 'axios';

const backendURL = 'http://localhost:10101';

async function getProjectList() {
  let response = await axios.get(`${backendURL}/project-list`, { timeout: 0 }).then(res => res.data);

  response.sort();
  return response;
}

async function getProjectTree(projectName) {
  let response = await axios.get(`${backendURL}/project-tree?project=${projectName}`, { timeout: 0 }).then(res => res.data);


  sortProjectTree(response);

  return response;
}

async function generateCode(projectTree, prompt) {
  const response = await axios.post(`${backendURL}/generate-code`, { projectTree, prompt }, { timeout: 0 }).then(res => res.data);


  return response;
}

async function integrateCode(projectTree, generatedCode) {
  const response = await axios.post(`${backendURL}/integrate-code`, { projectTree, generatedCode }, { timeout: 0 }).then(res => res.data);


  return response;
}

export default { getProjectList, getProjectTree, generateCode, integrateCode };