export const defaultIncludedFiletypes = [
  'jsx',
  'tsx',
  'vue',
  'svelte',

  'js',
  'mjs',
  'ts',
  'py',
  'rb',

  'html',
  'hbs',

  'sh',

  'txt',
  'md',

  'json',
  'yml',
  'yaml',
  'toml',
  'example',

  '',
];

// find at https://www.anthropic.com/api
// costs are in cents
export const costs = {
  haiku: {
    input: 100 * 0.25 / 1000000,
    output: 100 * 1.25 / 1000000,
  },
  opus: {
    input: 100 * 15 / 1000000,
    output: 100 * 75 / 1000000,
  } 
}