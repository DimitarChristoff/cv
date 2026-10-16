module.exports = {
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    'eslint-config-prettier',
  ],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect',
    },
    // Tells eslint how to resolve imports
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx'],
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'import/first': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/no-array-index-key': 0,
    'no-prototype-builtins': 0,
    'consistent-return': 0,
    'array-callback-return': 0,
    'default-case': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'no-shadow-restricted-names': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'no-unused-expressions': 0,
    'no-return-assign': 0,
    'no-alert': 0,
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-debugger': 0,
    'spaced-comment': 0,
    'no-nested-ternary': 0,
  },
}
