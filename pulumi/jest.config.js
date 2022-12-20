/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^@entities/(.*)$": "<rootDir>/domain/entities/$1",
    "^@entities$": "<rootDir>/domain/entities",
    "^@usecases/(.*)$": "<rootDir>/domain/usecases/$1",
    "^@usecases$": "<rootDir>/domain/usecases",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
  },
};
