"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auto_refresh_1 = require("../lib/auto-refresh");
const time_1 = require("../lib/time");
function DashboardHeader({ lastUpdatedAt }) {
    const [lastUpdatedLabel, setLastUpdatedLabel] = (0, react_1.useState)(() => lastUpdatedAt === null ? 'N/A' : (0, time_1.formatTimeAgo)(lastUpdatedAt, lastUpdatedAt));
    (0, react_1.useEffect)(() => {
        if (lastUpdatedAt === null) {
            return;
        }
        const intervalId = window.setInterval(() => {
            setLastUpdatedLabel((0, time_1.formatTimeAgo)(lastUpdatedAt, Date.now()));
        }, 1000);
        return () => window.clearInterval(intervalId);
    }, [lastUpdatedAt]);
    (0, react_1.useEffect)(() => (0, auto_refresh_1.scheduleAutoRefresh)(window), []);
    return ((0, jsx_runtime_1.jsxs)("header", { className: "dashboard-panel dashboard-frame navbar flex flex-col gap-4 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin signal board" }), (0, jsx_runtime_1.jsx)("h1", { className: "dashboard-heading text-2xl font-bold", children: "rORE Stats Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Live protocol analytics and market data" })] }), (0, jsx_runtime_1.jsx)("div", { className: "dashboard-chip rounded-xl px-4 py-3 text-xs", children: lastUpdatedAt === null ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Last updated", ' ', (0, jsx_runtime_1.jsx)("span", { id: "last-update", className: "dashboard-accent", children: "N/A" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Last updated", ' ', (0, jsx_runtime_1.jsx)("time", { id: "last-update", dateTime: new Date(lastUpdatedAt).toISOString(), className: "dashboard-accent", children: (0, time_1.formatTimestamp)(lastUpdatedAt) }), ' ', (0, jsx_runtime_1.jsxs)("span", { suppressHydrationWarning: true, children: ["(", lastUpdatedLabel, ")"] })] })) })] }));
}
