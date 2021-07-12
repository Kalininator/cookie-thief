module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['jest'],
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  rules: {
    // Disabling as it conflicts with prettier
    '@typescript-eslint/indent': 'off',
    'import/prefer-default-export': 'off',
  }
};
