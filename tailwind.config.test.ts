import assert from 'node:assert/strict';
import test from 'node:test';

import tailwindConfig from './tailwind.config';

test('scans the app directory for Tailwind classes', () => {
  assert.deepEqual(tailwindConfig.content, [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ]);
});

test('registers DaisyUI with the custom rore theme', () => {
  assert.equal(tailwindConfig.plugins?.length, 1);
  assert.equal(typeof tailwindConfig.plugins?.[0], 'function');
  assert.deepEqual(tailwindConfig.daisyui?.themes?.[0], {
    rore: {
      primary: '#ff9b45',
      secondary: '#f59e0b',
      accent: '#f97316',
      neutral: '#1a0f09',
      'base-100': '#120904',
      'base-200': '#1a0f09',
      'base-300': '#2b190f',
      'base-content': '#f5e7d7',
      info: '#38bdf8',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  });
});
