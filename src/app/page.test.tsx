import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import Home from './page';

const originalFetch = global.fetch;
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

test.afterEach(() => {
  global.fetch = originalFetch;

  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
    return;
  }

  process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
});

test('renders stats from the aggregated API endpoint', async () => {
  const lastUpdated = Date.parse('2026-03-09T12:34:56.000Z');
  const endTime = Date.now() + 10 * 60 * 1000;
  let requestedUrl = '';

  process.env.NEXT_PUBLIC_APP_URL = 'https://rore-stats.example';
  global.fetch = async (input) => {
    requestedUrl = input.toString();

    return new Response(
      JSON.stringify({
        wethPrice: 3210.45,
        rorePrice: 0.654321,
        motherlode: {
          totalValue: 98765,
          totalORELocked: 43210,
          participants: 246,
        },
        currentRound: {
          number: 12,
          status: 'active',
          prize: 777,
          entries: 88,
          endTime,
        },
        lastUpdated,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  };

  const markup = renderToStaticMarkup(await Home());

  assert.equal(requestedUrl, 'https://rore-stats.example/api/stats');
  assert.match(markup, /rORE Stats Dashboard/);
  assert.match(markup, /\$3210\.45/);
  assert.match(markup, /\$0\.654321/);
  assert.match(markup, /\$98,765/);
  assert.match(markup, /43,210/);
  assert.match(markup, /246/);
  assert.match(markup, /Current Round #12/);
  assert.match(markup, /777/);
  assert.match(markup, /88/);
  assert.match(markup, new RegExp(`id="last-update">${new Date(lastUpdated).toLocaleTimeString()}<\\/span>`));
});

test('renders fallback UI when the stats request fails', async () => {
  global.fetch = async () => new Response(null, { status: 500 });

  const markup = renderToStaticMarkup(await Home());

  assert.match(markup, /id="last-update">N\/A<\/span>/);
  assert.doesNotMatch(markup, /Current Round #/);
});
