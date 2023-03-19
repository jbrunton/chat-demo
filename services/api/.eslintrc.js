module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'boundaries'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:boundaries/strict',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'entities',
            allow: ['entities'],
          },
          {
            from: 'usecases',
            allow: ['entities', 'usecases'],
          },
          {
            from: 'data',
            allow: ['entities', 'data', 'config'],
          },
          {
            from: 'app',
            allow: ['entities', 'usecases', 'config', 'app'],
          },
          {
            from: 'main',
            allow: ['app', 'data', 'main'],
          },
        ],
      },
    ],
    'boundaries/external': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: ['app', 'main'],
            allow: ['*', '*/*'],
          },
          {
            from: ['data'],
            allow: [
              '@aws-sdk/*',
              '@nestjs/*',
              'dynamodb-onetable',
              '@casl/ability',
            ],
          },
          {
            from: ['config'],
            allow: ['@aws-sdk/client-dynamodb', '@nestjs/config', 'assert'],
          },
          {
            from: ['entities', 'usecases'],
            allow: [
              '@faker-js/faker',
              [
                '@nestjs/common',
                { specifiers: ['Injectable', 'UnauthorizedException'] },
              ],
            ],
          },
          {
            from: ['*'],
            allow: ['rambda'],
          },
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'boundaries/elements': [
      {
        type: 'entities',
        pattern: 'src/domain/entities',
      },
      {
        type: 'usecases',
        pattern: 'src/domain/usecases',
      },
      {
        type: 'data',
        pattern: 'src/data',
      },
      {
        type: 'config',
        pattern: 'src/config',
      },
      {
        type: 'app',
        pattern: ['src/app'],
      },
      {
        type: 'main',
        pattern: ['src/main.ts', 'src/main.module.ts'],
        mode: 'file',
      },
    ],
    'boundaries/ignore': [
      '**/*.spec.ts',
      '**/*.e2e-spec.ts',
      'src/fixtures/**',
      '**/__mocks__/**',
    ],
  },
};
