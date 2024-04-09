import { reactive } from 'vue';

export const store = reactive({
  generatedCode: null,
  inputCost: null,
  outputCost: null,
  totalCost: null,
  stop_reason: null,
  projectList: null,
  loading: false,
  projectName: null,
  task: null,
  projectTree: null,
  integrationMessage: null,
});
