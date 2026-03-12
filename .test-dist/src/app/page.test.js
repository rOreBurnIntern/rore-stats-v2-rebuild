"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const page_1 = __importDefault(require("./page"));
const originalFetch = global.fetch;
node_test_1.default.afterEach(() => {
    global.fetch = originalFetch;
});
(0, node_test_1.default)('PRD v3.1 layout: does not render Market Snapshot or Protocol Snapshot charts', async () => {
    const mockStatsData = {
        wethPrice: 3000,
        rorePrice: 0.5,
        blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
        winnerTypes: { winnerTakeAll: 10, split: 5 },
        motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [] },
        currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
        lastUpdated: Date.now(),
    };
    global.fetch = async () => new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const markup = (0, server_1.renderToStaticMarkup)(await (0, page_1.default)());
    (0, strict_1.default)(!markup.includes('Market Snapshot'), 'Market Snapshot should be absent');
    (0, strict_1.default)(!markup.includes('Protocol Snapshot'), 'Protocol Snapshot should be absent');
    (0, strict_1.default)(!markup.includes('motherlode-card'), 'MotherlodeCard should be absent');
    (0, strict_1.default)(!markup.includes('round-card'), 'RoundCard should be absent');
});
(0, node_test_1.default)('PRD v3.1 layout: single xl:grid-cols-2 grid contains WinnerTypePieChart and Block Performance', async () => {
    const mockStatsData = {
        wethPrice: 3000,
        rorePrice: 0.5,
        blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
        winnerTypes: { winnerTakeAll: 10, split: 5 },
        motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [] },
        currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
        lastUpdated: Date.now(),
    };
    global.fetch = async () => new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const markup = (0, server_1.renderToStaticMarkup)(await (0, page_1.default)());
    const gridMatches = markup.match(/xl:grid-cols-2/g);
    (0, strict_1.default)(gridMatches && gridMatches.length === 1, 'Exactly one xl:grid-cols-2 grid should exist');
    (0, strict_1.default)(markup.includes('Winner Types'), 'Winner Types title should be present');
    (0, strict_1.default)(markup.includes('Block Performance'), 'Block Performance title should be present');
});
(0, node_test_1.default)('PRD v3.1 layout: MotherlodeLineChart appears after grid with motherlode-trend class', async () => {
    const mockStatsData = {
        wethPrice: 3000,
        rorePrice: 0.5,
        blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
        winnerTypes: { winnerTakeAll: 10, split: 5 },
        motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [{ label: 'R1', value: 100 }] },
        currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
        lastUpdated: Date.now(),
    };
    global.fetch = async () => new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const markup = (0, server_1.renderToStaticMarkup)(await (0, page_1.default)());
    (0, strict_1.default)(markup.includes('motherlode-trend'), 'motherlode-trend class should be present');
    const gridIdx = markup.indexOf('xl:grid-cols-2');
    const lineChartIdx = markup.indexOf('motherlode-trend');
    (0, strict_1.default)(gridIdx > 0 && lineChartIdx > gridIdx, 'MotherlodeLineChart should appear after the grid');
});
(0, node_test_1.default)('PRD v3.1 layout: renders responsive structure', async () => {
    const mockStatsData = {
        wethPrice: 3000,
        rorePrice: 0.5,
        blockPerformance: Array.from({ length: 25 }, (_, i) => ({ block: i + 1, wins: i + 1 })),
        winnerTypes: { winnerTakeAll: 10, split: 5 },
        motherlode: { totalValue: 12345, totalORELocked: 67890, participants: 100, history: [{ label: 'R1', value: 100 }] },
        currentRound: { number: 1, status: 'active', prize: 1000, entries: 50, endTime: Date.now() + 60000 },
        lastUpdated: Date.now(),
    };
    global.fetch = async () => new Response(JSON.stringify(mockStatsData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const markup = (0, server_1.renderToStaticMarkup)(await (0, page_1.default)());
    (0, strict_1.default)(markup.includes('dashboard-panel'), 'DashboardHeader should render');
    (0, strict_1.default)(markup.includes('grid-cols-1') && markup.includes('md:grid-cols-3'), 'ProtocolStatCards grid should be present');
    (0, strict_1.default)(markup.includes('interactive-chart'), 'InteractiveBarChart should render');
});
