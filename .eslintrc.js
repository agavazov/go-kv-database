module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'quotes': [2, 'single', {'avoidEscape': true}],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    // '@typescript-eslint/no-unused-expressions': 'error',
    'curly': 'error',
    'max-len': [
      'error',
      {
        'code': 140,
        'ignoreUrls': true
      }
    ],
    'max-lines-per-function': [
      'error', {
        'max': 200
      }
    ],
    'no-caller': 'error',
    'no-empty': [
      'error', {
        'allowEmptyCatch': true
      }
    ],
    'no-eval': 'error',
    'no-multiple-empty-lines': 'error',
    'no-throw-literal': 'error',
    'padding-line-between-statements': [
      'error',
      {
        'blankLine': 'always',
        'prev': '*',
        'next': 'return'
      }
    ],
    'sort-imports': ['error', {'ignoreDeclarationSort': true}],
    'spaced-comment': [
      'error',
      'always',
      {
        'markers': ['/']
      }
    ]
    // 'no-case-declarations': 'error',
    // 'no-fallthrough': 'error',
    // 'no-underscore-dangle': 'error',
    // '@typescript-eslint/await-thenable': 'error',
    // '@typescript-eslint/ban-types': 'error',
    // '@typescript-eslint/no-empty-function': 'error',
    // '@typescript-eslint/explicit-module-boundary-types': 'error',
    // '@typescript-eslint/no-implied-eval': 'error',
    // '@typescript-eslint/no-var-requires': 'error',
    // '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    // '@typescript-eslint/no-unsafe-argument': 'error',
    // '@typescript-eslint/no-unsafe-assignment': 'error',
    // '@typescript-eslint/no-unsafe-call': 'error',
    // '@typescript-eslint/no-unsafe-member-access': 'error',
    // '@typescript-eslint/no-unsafe-return': 'error',
    // '@typescript-eslint/prefer-regexp-exec': 'error',
    // '@typescript-eslint/require-await': 'error',
    // '@typescript-eslint/restrict-plus-operands': 'error',
    // '@typescript-eslint/restrict-template-expressions': 'error',
    // '@typescript-eslint/unbound-method': 'error'
  }
};
