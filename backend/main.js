import express from 'express';
import cors from 'cors';
import { getProjectList, getProjectTree } from './scanProjects.js';
import { composePrompt } from './promptComposer.js';

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

app.post('/compose-prompt', async(req, res) => {
  const { projectName, projectTree, prompt } = req.body;
  const composedPrompt = await composePrompt(projectName, projectTree, prompt);
  res.send(composedPrompt);
});

const port = 10101;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});