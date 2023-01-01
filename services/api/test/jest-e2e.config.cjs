const baseConfig = require('../jest.config.cjs');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...baseConfig,
  rootDir: '../',
  testRegex: '.e2e-spec.ts$',
};
