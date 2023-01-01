/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@lib/(.*)$': ['<rootDir>/src/lib/$1'],
    '^@features/(.*)$': ['<rootDir>/src/features/$1'],
    '^@data/(.*)$': ['<rootDir>/src/data/$1'],
    '^@config/(.*)$': ['<rootDir>/src/config/$1'],
  },
};
