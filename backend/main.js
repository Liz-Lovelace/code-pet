import express from 'express';
import path from 'path';
import cors from 'cors';
import { getProjectList, getProjectTree } from './scanProjects.js';
import { composeCodegenPrompt, composeIntegratorPrompt} from './promptComposer.js';
import { askAI, streamAskAI } from './askAI.js';
import { parseDiff, applyDiff } from './integrator.js';
import { sleep } from './backendUtils.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));


app.get('/project-list', async(req, res) => {
  let projects = await getProjectList();
  res.json(projects);
});

app.get('/project-tree', async(req, res) => {
  const projectName = req.query.project;
  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  let project = await getProjectTree(projectName);

  res.json(project);
});

let globalStreamObject;
app.post('/generate-code', async(req, res) => {
  const { projectTree, prompt } = req.body;
  const [codegenSystemPrompt, codegenPrompt] = await composeCodegenPrompt(projectTree, prompt);
  // todo: haiku is only for debug, generating code should be done with opus
  globalStreamObject = await streamAskAI(codegenSystemPrompt, codegenPrompt, 'opus');
  res.json({status: 'ok'})
});

app.get('/generated-code', async(req, res) => {
  res.json(globalStreamObject)
});

app.post('/integrate-code', async(req, res) => {
  const { projectTree, generatedCode } = req.body;
  const [integratorSystemPrompt, integratorPrompt] = await composeIntegratorPrompt(projectTree, generatedCode);
  const result = await askAI(integratorSystemPrompt, integratorPrompt, 'haiku');
  let diff = parseDiff(result.content[0].text)
  await applyDiff(diff);
  // console.log(result.content[0].text)
  res.json({status: 'ok', message: `Code integrated! Check your files`});
});

const port = 10101;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
