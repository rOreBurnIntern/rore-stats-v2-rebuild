import assert from 'node:assert/strict';
import test from 'node:test';
import packageJson from './package.json';

test('uses the default Next.js production build command', () => {
  assert.equal(packageJson.scripts.build, 'next build');
});

test('pins a Next.js 14 stack with Tailwind CSS and DaisyUI', () => {
  assert.equal(packageJson.dependencies.next, '14.2.3');
  assert.equal(packageJson.dependencies.react, '18.2.0');
  assert.equal(packageJson.dependencies['react-dom'], '18.2.0');
  assert.equal(packageJson.dependencies.daisyui, '4.12.24');
  assert.equal(packageJson.devDependencies.tailwindcss, '3.4.1');
  assert.equal(packageJson.devDependencies.postcss, '8.4.38');
  assert.equal(packageJson.devDependencies.autoprefixer, '10.4.19');
});
