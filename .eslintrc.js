module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard', 'prettier'],

  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  rules: {
    'no-unused-vars': 'error',
    camelcase: 'off'
  },
  globals: {
    __DEV__: true
  },
  env: {
    'cypress/globals': true
  }
}
