/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  modulePathIgnorePatterns: ['<rootDir>/dist/*'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': ['<rootDir>/src/app/$1'],
    '^@data/(.*)$': ['<rootDir>/src/data/$1'],
    '^@config/(.*)$': ['<rootDir>/src/config/$1'],
    '^@fixtures/(.*)$': ['<rootDir>/src/fixtures/$1'],
    '^@entities/(.*)$': ['<rootDir>/src/domain/entities/$1'],
    '^@usecases/(.*)$': ['<rootDir>/src/domain/usecases/$1'],
  },
  coverageDirectory: 'coverage',
};
