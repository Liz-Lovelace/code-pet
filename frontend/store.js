import { reactive } from 'vue';

export const store = reactive({
  generatedCode: '',
  inputCost: '',
  outputCost: '',
  totalCost: '',
  stop_reason: '',
  projectList: [],
});
