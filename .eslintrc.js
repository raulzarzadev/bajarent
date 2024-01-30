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
  rules: {},
  globals: {
    __DEV__: true
  }
}
