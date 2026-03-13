import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

const originalFetch = global.fetch;

test.afterEach(() => {
  global.fetch = originalFetch;
});

test('PRD v3.1 layout: does not render Market Snapshot or Protocol Snapshot charts', async () => {
  const mockStatsData = {
    wethPrice: 3000,
    rorePrice: 0.5,
    blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
    winnerTypes: { winnerTakeAll: 10, split: 5 },
    motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [] },
    currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
    lastUpdated: Date.now(),
  };

  global.fetch = async () =>
    new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const markup = renderToStaticMarkup(await Home());

  assert(!markup.includes('Market Snapshot'), 'Market Snapshot should be absent');
  assert(!markup.includes('Protocol Snapshot'), 'Protocol Snapshot should be absent');
  assert(!markup.includes('motherlode-card'), 'MotherlodeCard should be absent');
  assert(!markup.includes('round-card'), 'RoundCard should be absent');
});

test('PRD v3.1 layout: single xl:grid-cols-2 grid contains WinnerTypePieChart and Block Performance', async () => {
  const mockStatsData = {
    wethPrice: 3000,
    rorePrice: 0.5,
    blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
    winnerTypes: { winnerTakeAll: 10, split: 5 },
    motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [] },
    currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
    lastUpdated: Date.now(),
  };

  global.fetch = async () =>
    new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const markup = renderToStaticMarkup(await Home());

  const gridMatches = markup.match(/xl:grid-cols-2/g);
  assert(gridMatches && gridMatches.length === 1, 'Exactly one xl:grid-cols-2 grid should exist');
  assert(markup.includes('Winner Types'), 'Winner Types title should be present');
  assert(markup.includes('Block Performance'), 'Block Performance title should be present');
});

test('PRD v3.1 layout: MotherlodeLineChart appears after grid with motherlode-trend class', async () => {
  const mockStatsData = {
    wethPrice: 3000,
    rorePrice: 0.5,
    blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
    winnerTypes: { winnerTakeAll: 10, split: 5 },
    motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [{ label: 'R1', value: 100 }] },
    currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
    lastUpdated: Date.now(),
  };

  global.fetch = async () =>
    new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const markup = renderToStaticMarkup(await Home());

  assert(markup.includes('motherlode-trend'), 'motherlode-trend class should be present');
  const gridIdx = markup.indexOf('xl:grid-cols-2');
  const lineChartIdx = markup.indexOf('motherlode-trend');
  assert(gridIdx > 0 && lineChartIdx > gridIdx, 'MotherlodeLineChart should appear after the grid');
});

test('PRD v3.1 layout: renders responsive structure', async () => {
  const mockStatsData = {
    wethPrice: 3000,
    rorePrice: 0.5,
    blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
    winnerTypes: { winnerTakeAll: 10, split: 5 },
    motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [{ label: 'R1', value: 100 }] },
    currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
    lastUpdated: Date.now(),
  };

  global.fetch = async () =>
    new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const markup = renderToStaticMarkup(await Home());

  assert(markup.includes('dashboard-panel'), 'DashboardHeader should render');
  assert(markup.includes('text-theme-text'), 'Home wrapper should use the shared theme text color');
  assert(markup.includes('grid-cols-1') && markup.includes('md:grid-cols-3'), 'ProtocolStatCards grid should be present');
  assert(markup.includes('interactive-chart'), 'InteractiveBarChart should render');
});
