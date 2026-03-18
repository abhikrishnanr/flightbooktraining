import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: ['node_modules/**', 'node_modules_broken_*/**', '.next/**']
  },
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off'
    }
  }
];
