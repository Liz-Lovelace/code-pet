import { reactive } from 'vue';

export const store = reactive({
  generatedCode: {
    text: 'Generated code will appear here',
    inputCost: 0,
    outputCost: 0,
    status: 'awaiting prompt'
  },
  projectList: null,
  projectName: null,
  task: null,
  projectTree: null,
  currentTab: 'task',
  diff: [],
});
