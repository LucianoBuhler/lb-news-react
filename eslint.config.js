import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import tsEslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
   // Configuration for JavaScript/JSX files
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
   // Configuration for TypeScript/TSX files
  ...tsEslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // Point to your tsconfig.json for type-aware linting
      },
    },
    rules: {
      // Disable the base JS no-unused-vars rule for TS files to avoid conflicts
      'no-unused-vars': 'off',
      // Enable the TypeScript-specific no-unused-vars rule
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
      // Add any other TypeScript-specific rules or overrides here
    },
  },
])
