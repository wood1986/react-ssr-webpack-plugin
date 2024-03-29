/* eslint-disable no-magic-numbers */
module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "worker": true,
    "serviceworker": true,
    "jest": true,
    "jest/globals": true,
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "globals": {
    "globalThis": false,
    "__non_webpack_require__": false,
    "__webpack_public_path__": false,
    "__SOURCES__": false,
    "__FILES__": false,
    "__DIGESTS__": false,
    "NAME": false,
    "VERSION": false,
    "DEBUG": false,
  },
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "plugins": ["jest", "react-hooks"],
  "rules": {
    "array-bracket-newline": [2, {"multiline": true}],
    "array-element-newline": [2, "consistent"],
    "capitalized-comments": 0,
    "comma-dangle": [2, "always-multiline"],
    "eol-last": [2, "always"],
    "id-length": 1,
    "line-comment-position": 0,
    "max-len": 0,
    "max-lines-per-function": 1,
    "max-statements": 1,
    "multiline-comment-style": 0,
    "multiline-ternary": [2, "always-multiline"],
    "no-bitwise": 0,
    "no-console": 1,
    "no-debugger": 1,
    "no-confusing-arrow": 0,
    "no-inline-comments": 0,
    "no-magic-numbers": [1, {"ignore": [-1, 0, 1]}],
    "no-mixed-operators": 0,
    "no-mixed-requires": 1,
    "no-multiple-empty-lines": [2, {"max": 1}],
    "no-plusplus": 0,
    "no-ternary": 0,
    "no-trailing-spaces": 2,
    "no-unused-vars": [2, {"argsIgnorePattern": "^_"}],
    "one-var": [2, "never"],
    "object-curly-spacing": [2, "never"],
    "object-property-newline": [2, {"allowAllPropertiesOnSameLine": true}],
    "padded-blocks": [2, "never"],
    "quotes": [2, "double"],
    "quote-props": [2, "always"],
    "semi": [2, "always"],
    "sort-imports": 1,
    "sort-vars": 1,
    "react-hooks/rules-of-hooks": 1,
    "react/prop-types": 0,
    "react/jsx-uses-react": 0,
    "react/react-in-jsx-scope": 0,
  },
  "settings": {
    "react": {
      "version": "latest",
    },
  },
};
