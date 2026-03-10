import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import RootLayout, { metadata } from './layout';

test('exposes dashboard metadata for the Next.js app shell', () => {
  assert.equal(metadata.title, 'rORE Stats Dashboard');
  assert.equal(metadata.description, 'Next.js 14 dashboard initialized with Tailwind CSS and DaisyUI.');
});

test('renders the DaisyUI theme on the root html element', () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <div>Dashboard</div>
    </RootLayout>
  );

  assert.match(markup, /<html lang="en" data-theme="rore">/);
  assert.match(markup, /<body class="[^"]*bg-base-200[^"]*text-base-content[^"]*antialiased[^"]*">/);
});
