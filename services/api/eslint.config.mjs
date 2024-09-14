import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js'],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:boundaries/strict',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      boundaries,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir:
          '/Users/johnbrunton/git/jbrunton/chat-demo/services/api',
      },
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
          pattern: ['src/data/*/*', 'src/data'],
          mode: 'folder',
          capture: ['kind', 'adapterType'],
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
        'test/**',
        'scripts/**',
      ],
    },

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
              from: [
                [
                  'data',
                  {
                    adapterType: 'test',
                  },
                ],
              ],

              allow: ['@faker-js/faker'],
            },
            {
              from: ['config'],
              allow: ['@aws-sdk/client-dynamodb', '@nestjs/config', 'assert'],
            },
            {
              from: ['entities'],
              allow: ['@faker-js/faker'],
            },
            {
              from: ['usecases'],

              allow: [
                '@faker-js/faker',
                [
                  '@nestjs/common',
                  {
                    specifiers: [
                      'Injectable',
                      'UnauthorizedException',
                      'BadRequestException',
                      'Logger',
                    ],
                  },
                ],
              ],
            },
            {
              from: ['*'],
              allow: ['rambda', 'remeda', 'rxjs', 'zod'],
            },
          ],
        },
      ],
    },
  },
];
