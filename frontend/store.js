import { reactive } from 'vue';

export const store = reactive({
  generatedCode: {
    text: 'Generated code will appear here',
    inputCost: 0,
    outputCost: 0,
    status: 'awaiting prompt'
  },
  projectList: null,
  loading: false,
  projectName: null,
  task: null,
  projectTree: null,
  integrationMessage: null,
});
