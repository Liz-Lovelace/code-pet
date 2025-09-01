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
export const costs = {
  haiku: {
    input: 0.25 / 1000000,
    output: 1.25 / 1000000,
  },
  sonnet: {
    input: 3 / 1000000,
    output: 15 / 1000000,
  },
  opus: {
    input: 15 / 1000000,
    output: 75 / 1000000,
  },
};

export const strings = {
  up: `ദ്ദി（• ˕ •マ`,
  catbody: `ᓚᘏᗢ`,
  divider: `=ᗢ=`,
}