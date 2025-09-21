module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'next',
    'next/core-web-vitals'
  ],
  rules: {
    '@next/next/no-img-element': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  },
};