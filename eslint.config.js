import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      /** quotes
       * Vynucuje pouziti jednoduchych uvozovek (' misto ").
       */
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      /** semi
       * Vyzaduje stredniky na konci prikazu.
       */
      semi: ['error', 'always'],

      /** comma-dangle
       * Zakazuje trailing carku na konci objektu/array.
       */
      'comma-dangle': ['error', 'never'],

      /** eqeqeq
       * Vynucuje striktni porovnani (=== misto ==).
       */
      eqeqeq: ['error', 'always'],

      /** prefer-const
       * Pouzije const misto let, pokud se promenna nemeni.
       */
      'prefer-const': 'error',

      /** no-console
       * Zakazuje console.log, povoluje jen warn a error.
       */
      'no-console': ['error', { allow: ['warn', 'error'] }],

      /** react-hooks/rules-of-hooks
       * Kontroluje spravne pouziti React hooks.
       */
      'react-hooks/rules-of-hooks': 'error',

      /** @typescript-eslint/consistent-type-imports
       * Vynucuje oddeleni type importu.
       */
      '@typescript-eslint/consistent-type-imports': 'error',

      /** @typescript-eslint/no-unused-vars
       * Varuje pri nepouzitych promennych.
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
]);
