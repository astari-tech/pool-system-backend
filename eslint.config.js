import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-unused-vars': ['warn'],
      'prettier/prettier': ['error'] // <- obriga seguir o Prettier
    },
    ignores: ['node_modules', '.env'],
    settings: {},
    // aplica as regras do Prettier por último para evitar conflito com ESLint
    ...prettier
  }
])
