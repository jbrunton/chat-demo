const baseConfig = require('../jest.config.js');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...baseConfig,
  rootDir: '../',
  testRegex: '.e2e-spec.ts$',
  globalSetup: '<rootDir>/src/fixtures/setup-e2e.ts',
  globalTeardown: '<rootDir>/src/fixtures/teardown-e2e.ts',
};
