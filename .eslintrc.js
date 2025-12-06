module.exports = {
   root: true,
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',
   },
   plugins: [
      '@typescript-eslint',
      'prettier',
      'import',
      'unicorn',
      'prefer-arrow',
   ],
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
   ],
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
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'require-await': 'error',
      'no-return-await': 'error',
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
            ignore: ['\\.config\\.js$', '\\.eslintrc\\.js$'],
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
      'import/no-extraneous-dependencies': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
         'error',
         {
            groups: [
               'builtin',
               'external',
               'internal',
               'parent',
               'sibling',
               'index',
            ],
            'newlines-between': 'always',
            alphabetize: {
               order: 'asc',
               caseInsensitive: true,
            },
         },
      ],

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
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
         'error',
         { prefer: 'type-imports' },
      ],

      // === Prettier integratsiyasi ===
      'prettier/prettier': [
         'error',
         {
            semi: false,
            singleQuote: true,
            trailingComma: 'all',
            endOfLine: 'auto',
            tabWidth: 3,
            printWidth: 80,
            arrowParens: 'always',
         },
      ],
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
   ignorePatterns: ['dist', 'node_modules', '*.config.js'],
}
