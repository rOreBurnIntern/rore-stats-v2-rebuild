"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_module_1 = require("node:module");
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const DashboardHeader_1 = __importDefault(require("./DashboardHeader"));
const moduleRequire = (0, node_module_1.createRequire)(__filename);
(0, node_test_1.default)('renders the last updated timestamp when stats are available', () => {
    const lastUpdatedAt = Date.parse('2026-03-09T12:34:56.000Z');
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardHeader_1.default, { lastUpdatedAt: lastUpdatedAt }));
    strict_1.default.match(markup, /Burncoin signal board/);
    strict_1.default.match(markup, /rORE Stats Dashboard/);
    strict_1.default.match(markup, /Live protocol analytics and market data/);
    strict_1.default.match(markup, /class="[^"]*dashboard-chip[^"]*"/);
    strict_1.default.match(markup, /Last updated <time id="last-update" dateTime="2026-03-09T12:34:56\.000Z"[^>]*>Mar 9, 2026, 12:34:56 PM UTC<\/time> <span[^>]*>\(0 seconds ago\)<\/span>/);
});
(0, node_test_1.default)('renders an N\\/A last updated state when stats are unavailable', () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardHeader_1.default, { lastUpdatedAt: null }));
    strict_1.default.match(markup, /Last updated <span id="last-update" class="dashboard-accent">N\/A<\/span>/);
    strict_1.default.doesNotMatch(markup, /<time id="last-update"/);
});
(0, node_test_1.default)('schedules browser auto-refresh on mount and cleans it up on unmount', () => {
    const reactModule = moduleRequire('react');
    const autoRefreshModule = moduleRequire('../lib/auto-refresh');
    const originalUseEffect = reactModule.useEffect;
    const originalScheduleAutoRefresh = autoRefreshModule.scheduleAutoRefresh;
    const globalWithWindow = globalThis;
    const hadWindow = 'window' in globalWithWindow;
    const originalWindow = globalWithWindow.window;
    const effectCleanups = [];
    const refreshWindow = {};
    let scheduledWindow;
    let cleanupCalls = 0;
    globalWithWindow.window = refreshWindow;
    reactModule.useEffect = ((effect) => {
        const cleanup = effect();
        if (typeof cleanup === 'function') {
            effectCleanups.push(cleanup);
        }
    });
    autoRefreshModule.scheduleAutoRefresh = (refreshWindow) => {
        scheduledWindow = refreshWindow;
        return () => {
            cleanupCalls += 1;
        };
    };
    try {
        (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardHeader_1.default, { lastUpdatedAt: null }));
    }
    finally {
        reactModule.useEffect = originalUseEffect;
        autoRefreshModule.scheduleAutoRefresh =
            originalScheduleAutoRefresh;
        if (hadWindow) {
            globalWithWindow.window = originalWindow;
        }
        else {
            delete globalWithWindow.window;
        }
    }
    strict_1.default.equal(scheduledWindow, refreshWindow);
    strict_1.default.equal(effectCleanups.length, 1);
    effectCleanups[0]();
    strict_1.default.equal(cleanupCalls, 1);
});
