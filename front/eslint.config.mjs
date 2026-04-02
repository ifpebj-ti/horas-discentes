import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextConfig from 'eslint-config-next';
import importHelpers from 'eslint-plugin-import-helpers';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      '**/.next/',
      '**/node_modules/',
      '**/public/',
      '**/build/',
      '**/dist/'
    ]
  },
  ...nextConfig,
  ...fixupConfigRules(
    compat.extends(
      'plugin:prettier/recommended',
      'plugin:@tanstack/eslint-plugin-query/recommended'
    )
  ),
  {
    plugins: {
      prettier: fixupPluginRules(prettier),
      'import-helpers': fixupPluginRules(importHelpers),
      'unused-imports': fixupPluginRules(unusedImports)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        },
        {
          usePrettierrc: true
        }
      ],

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            ['/^react/', '/^next/', '/@next/'],
            '/components/',
            'module',
            '/^@shared/',
            '/absolute/',
            ['parent', 'sibling', 'index']
          ],

          alphabetize: {
            order: 'asc',
            ignoreCase: true
          }
        }
      ],
      'unused-imports/no-unused-imports': 'error'
    }
  },
  {
    files: [
      '**/__tests__/**/*',
      '**/*.test.js',
      '**/*.spec.js',
      '**/*.test.ts',
      '**/*.spec.ts'
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
];
