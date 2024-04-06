import express from 'express';
import cors from 'cors';
import { getProjectList, getProjectTree } from './scanProjects.js';
import { composeCodegenPrompt, composeIntegratorPrompt} from './promptComposer.js';
import { askAI } from './askAI.js';
import { parseDiff, applyDiff } from './integrator.js';

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/generate-code', async(req, res) => {
  console.log('generating code...')
  const { projectTree, prompt } = req.body;
  const [codegenSystemPrompt, codegenPrompt] = await composeCodegenPrompt(projectTree, prompt);
  // todo: haiku is only for debug, generating code should be done with opus
  const generatedCode = await askAI(codegenSystemPrompt, codegenPrompt, 'opus');
  console.log(generatedCode.content[0].text)
  res.json(generatedCode);
  console.log('...code generated :3')
});

app.post('/integrate-code', async(req, res) => {
  console.log('integrating code...')
  const { projectTree, generatedCode } = req.body;
  const [integratorSystemPrompt, integratorPrompt] = await composeIntegratorPrompt(projectTree, generatedCode);
  const result = await askAI(integratorSystemPrompt, integratorPrompt, 'haiku');
  let diff = parseDiff(result.content[0].text)
  await applyDiff(diff);
  console.log(result.content[0].text)
  res.json({status: 'ok', message: `Code integrated! Check your files`});
  console.log('...code integrated :3')
});

const port = 10101;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});