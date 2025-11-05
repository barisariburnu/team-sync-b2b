import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import security from 'eslint-plugin-security';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      security,
      'unused-imports': unusedImports,
    },
    extends: [
      js.configs.recommended,
      // Security plugin recommended
      security.configs.recommended,
      // Disable formatting-related ESLint rules (handled by Prettier)
      prettier,
    ],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      'security/detect-object-injection': 'off',
    },
  },
);
