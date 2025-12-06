import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import preferArrow from 'eslint-plugin-prefer-arrow'
import prettier from 'eslint-plugin-prettier'
import unicorn from 'eslint-plugin-unicorn'

export default [
   {
      ignores: ['dist', 'node_modules', '*.config.js'],
   },
   js.configs.recommended,
   {
      files: ['**/*.ts'],
      languageOptions: {
         parser: typescriptParser,
         parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            project: './tsconfig.json',
         },
         globals: {
            __dirname: 'readonly',
            NodeJS: 'readonly',
            process: 'readonly',
            console: 'readonly',
            fetch: 'readonly',
         },
      },
      plugins: {
         '@typescript-eslint': typescript,
         prettier: prettier,
         import: importPlugin,
         unicorn: unicorn,
         'prefer-arrow': preferArrow,
      },
      rules: {
         // === Code style & structure ===
         'no-var': 'error',
         'prefer-const': 'error',
         'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
               disallowPrototype: true,
               singleReturnOnly: false,
               classPropertiesAllowed: false,
            },
         ],
         'no-console': 'warn',
         'no-debugger': 'error',
         'no-alert': 'error',
         'no-duplicate-imports': 'off',
         'no-template-curly-in-string': 'error',
         'no-unreachable': 'error',
         'no-unreachable-loop': 'error',
         'no-unused-private-class-members': 'error',
         'require-await': 'warn',
         'no-return-await': 'error',
         'no-undef': 'off',
         eqeqeq: ['error', 'always'],
         'no-eval': 'error',
         'no-implied-eval': 'error',
         'no-magic-numbers': [
            'warn',
            {
               ignore: [0, 1, -1],
               ignoreArrayIndexes: true,
               ignoreDefaultValues: true,
            },
         ],
         curly: ['error', 'all'],
         'default-case': 'error',
         'default-case-last': 'error',
         'no-else-return': 'error',
         'no-empty-function': 'error',
         'no-lonely-if': 'error',
         'no-useless-return': 'error',
         'prefer-template': 'error',
         yoda: 'error',

         // === Naming conventions ===
         'unicorn/filename-case': [
            'error',
            {
               cases: {
                  kebabCase: true,
               },
               ignore: ['\\.config\\.js$'],
            },
         ],
         '@typescript-eslint/naming-convention': [
            'error',
            {
               selector: 'variable',
               format: ['camelCase', 'UPPER_CASE'],
               leadingUnderscore: 'allow',
            },
            {
               selector: 'function',
               format: ['camelCase'],
            },
            {
               selector: 'parameter',
               format: ['camelCase'],
               leadingUnderscore: 'allow',
            },
            {
               selector: 'class',
               format: ['PascalCase'],
            },
            {
               selector: 'interface',
               format: ['PascalCase'],
               prefix: ['I'],
            },
            {
               selector: 'typeAlias',
               format: ['PascalCase'],
            },
            {
               selector: 'enum',
               format: ['PascalCase'],
            },
            {
               selector: 'enumMember',
               format: ['UPPER_CASE'],
            },
         ],

         // === Import qoidalari ===
         'import/no-default-export': 'error',
         'import/named': 'error',
         'import/namespace': 'error',
         'import/no-duplicates': 'error',
         'import/no-self-import': 'error',
         'import/no-useless-path-segments': 'error',
         'import/first': 'error',
         'import/newline-after-import': 'error',
         'import/order': 'off',

         // === TypeScript qoidalari ===
         '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
               allowExpressions: true,
               allowTypedFunctionExpressions: true,
            },
         ],
         '@typescript-eslint/explicit-module-boundary-types': 'error',
         '@typescript-eslint/no-unused-vars': [
            'error',
            {
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_',
            },
         ],
         '@typescript-eslint/no-explicit-any': 'error',
         '@typescript-eslint/no-non-null-assertion': 'error',
         '@typescript-eslint/no-floating-promises': 'error',
         '@typescript-eslint/await-thenable': 'error',
         '@typescript-eslint/no-misused-promises': 'error',
         '@typescript-eslint/prefer-nullish-coalescing': 'error',
         '@typescript-eslint/prefer-optional-chain': 'error',
         '@typescript-eslint/strict-boolean-expressions': [
            'error',
            {
               allowString: false,
               allowNumber: false,
               allowNullableObject: false,
            },
         ],
         '@typescript-eslint/no-unnecessary-condition': 'error',
         '@typescript-eslint/prefer-readonly': 'error',
         '@typescript-eslint/prefer-as-const': 'error',
         '@typescript-eslint/array-type': [
            'error',
            { default: 'array-simple' },
         ],
         '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface',
         ],
         '@typescript-eslint/consistent-type-imports': [
            'error',
            { prefer: 'type-imports' },
         ],

         // === Prettier integratsiyasi ===
         'prettier/prettier': 'error',
      },
      settings: {
         'import/resolver': {
            typescript: {
               alwaysTryTypes: true,
               project: './tsconfig.json',
            },
            node: {
               extensions: ['.js', '.ts'],
            },
         },
         'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
         },
      },
   },
   prettierConfig,
]
