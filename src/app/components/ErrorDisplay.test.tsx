import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import ErrorDisplay from './ErrorDisplay';

test('renders the error display with default title and alert semantics', () => {
  const markup = renderToStaticMarkup(
    <ErrorDisplay message="We could not load the latest stats right now. Please try again in a few minutes." />
  );

  assert.match(markup, /role="alert"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /Stats unavailable/);
  assert.match(markup, /We could not load the latest stats right now\. Please try again in a few minutes\./);
  assert.match(markup, /class="[^"]*dashboard-alert[^"]*dashboard-frame[^"]*alert[^"]*"/);
  assert.match(markup, /dashboard-ember/);
});

test('renders a custom title when one is provided', () => {
  const markup = renderToStaticMarkup(
    <ErrorDisplay
      title="Network issue"
      message="The upstream API is temporarily unavailable."
    />
  );

  assert.match(markup, /Network issue/);
  assert.match(markup, /The upstream API is temporarily unavailable\./);
});
