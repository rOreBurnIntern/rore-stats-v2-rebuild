import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import DashboardHeader from './DashboardHeader';

const moduleRequire = createRequire(__filename);

test('renders the last updated timestamp when stats are available', () => {
  const lastUpdatedAt = Date.parse('2026-03-09T12:34:56.000Z');
  const markup = renderToStaticMarkup(<DashboardHeader lastUpdatedAt={lastUpdatedAt} />);

  assert.match(markup, /rORE signal board/);
  assert.match(markup, /rORE Stats Dashboard/);
  assert.match(markup, /Live protocol analytics and market data/);
  assert.match(markup, /class="[^"]*dashboard-chip[^"]*"/);
  assert.match(markup, /Last updated <time id="last-update" dateTime="2026-03-09T12:34:56\.000Z"[^>]*>Mar 9, 2026, 12:34:56 PM UTC<\/time> <span[^>]*>\(0 seconds ago\)<\/span>/);
});

test('renders an N\\/A last updated state when stats are unavailable', () => {
  const markup = renderToStaticMarkup(<DashboardHeader lastUpdatedAt={null} />);

  assert.match(markup, /Last updated <span id="last-update" class="dashboard-accent">N\/A<\/span>/);
  assert.doesNotMatch(markup, /<time id="last-update"/);
});

test('schedules browser auto-refresh on mount and cleans it up on unmount', () => {
  const reactModule = moduleRequire('react') as typeof import('react');
  const autoRefreshModule = moduleRequire('../lib/auto-refresh') as typeof import('../lib/auto-refresh');
  const originalUseEffect = reactModule.useEffect;
  const originalScheduleAutoRefresh = autoRefreshModule.scheduleAutoRefresh;
  const globalWithWindow = globalThis as typeof globalThis & {
    window?: Window & typeof globalThis;
  };
  const hadWindow = 'window' in globalWithWindow;
  const originalWindow = globalWithWindow.window;
  const effectCleanups: Array<() => void> = [];
  const refreshWindow = {} as Window & typeof globalThis;
  let scheduledWindow: unknown;
  let cleanupCalls = 0;

  globalWithWindow.window = refreshWindow;
  (reactModule as { useEffect: typeof reactModule.useEffect }).useEffect = ((effect) => {
    const cleanup = effect();

    if (typeof cleanup === 'function') {
      effectCleanups.push(cleanup);
    }
  }) as typeof reactModule.useEffect;
  (autoRefreshModule as { scheduleAutoRefresh: typeof autoRefreshModule.scheduleAutoRefresh }).scheduleAutoRefresh = (
    refreshWindow
  ) => {
    scheduledWindow = refreshWindow;

    return () => {
      cleanupCalls += 1;
    };
  };

  try {
    renderToStaticMarkup(<DashboardHeader lastUpdatedAt={null} />);
  } finally {
    (reactModule as { useEffect: typeof reactModule.useEffect }).useEffect = originalUseEffect;
    (autoRefreshModule as { scheduleAutoRefresh: typeof autoRefreshModule.scheduleAutoRefresh }).scheduleAutoRefresh =
      originalScheduleAutoRefresh;

    if (hadWindow) {
      globalWithWindow.window = originalWindow;
    } else {
      delete (globalWithWindow as { window?: Window & typeof globalThis }).window;
    }
  }

  assert.equal(scheduledWindow, refreshWindow);
  assert.equal(effectCleanups.length, 1);

  effectCleanups[0]();
  assert.equal(cleanupCalls, 1);
});
