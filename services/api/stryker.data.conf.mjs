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
  mutate: ['src/data/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.e2e-spec.ts'],
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.',
  coverageAnalysis: 'perTest',
  dashboard: {
    module: 'api-data',
  },
  jest: {
    configFile: 'test/jest-e2e.config.cjs',
  },
};
export default config;
