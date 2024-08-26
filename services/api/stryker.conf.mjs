// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'pnpm',
  reporters: ['html', 'dashboard'],
  testRunner: 'jest',
  plugins: ['@stryker-mutator/jest-runner'],
  ignoreStatic: true,
  mutate: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/fixtures/**/*.ts',
    '!src/data/**/*.ts',
  ],
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
  coverageAnalysis: 'perTest',
  dashboard: {
    module: 'api',
  },
};
export default config;
