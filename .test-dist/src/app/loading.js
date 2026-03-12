"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Loading;
const jsx_runtime_1 = require("react/jsx-runtime");
function SkeletonBlock({ className }) {
    return ((0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", className: `animate-pulse rounded bg-[var(--accent-soft)] ${className}` }));
}
function SkeletonStatCard({ title, showSubtitle = false, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card dashboard-frame card w-full min-w-0 rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "dashboard-subtle text-sm font-medium uppercase tracking-[0.18em]", children: title }), (0, jsx_runtime_1.jsx)("span", { className: "dashboard-ember mt-1 h-2.5 w-2.5 rounded-full", "aria-hidden": "true" })] }), (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "h-8 w-3/4" }), showSubtitle && (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "mt-3 h-4 w-full max-w-[14rem]" })] }));
}
function SkeletonChart({ title, bars, }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "dashboard-panel dashboard-frame rounded-2xl p-6", "aria-label": `${title} loading state`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin spread" }), (0, jsx_runtime_1.jsx)("h3", { className: "dashboard-heading text-base font-semibold", children: title }), (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "mt-2 h-4 w-full max-w-sm" })] }), (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "h-7 w-44 rounded-full" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "interactive-chart", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsxs)("div", { className: "interactive-chart__grid", children: [(0, jsx_runtime_1.jsx)("span", {}), (0, jsx_runtime_1.jsx)("span", {}), (0, jsx_runtime_1.jsx)("span", {}), (0, jsx_runtime_1.jsx)("span", {})] }), (0, jsx_runtime_1.jsx)("ul", { className: "interactive-chart__bars", children: bars.map((bar, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "interactive-chart__item", children: [(0, jsx_runtime_1.jsx)("div", { className: "interactive-chart__bar-group", children: (0, jsx_runtime_1.jsx)("div", { className: "interactive-chart__bar animate-pulse", style: {
                                            height: bar.height,
                                            background: 'linear-gradient(180deg, rgba(255, 179, 71, 0.36), rgba(255, 138, 42, 0.14))',
                                        } }) }), (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "mx-auto mt-3 h-3 w-12" })] }, `${title}-${index}`))) })] })] }));
}
function SkeletonPanel({ kicker, title, cardTitles, }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "dashboard-panel dashboard-frame rounded-2xl p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: kicker }), (0, jsx_runtime_1.jsx)("h3", { className: "dashboard-heading mb-4 text-base font-semibold", children: title }), (0, jsx_runtime_1.jsx)("div", { className: `grid grid-cols-1 gap-4 ${cardTitles.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`, children: cardTitles.map((cardTitle) => ((0, jsx_runtime_1.jsx)(SkeletonStatCard, { title: cardTitle, showSubtitle: true }, cardTitle))) })] }));
}
function Loading() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8", "aria-busy": "true", "aria-live": "polite", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Loading dashboard statistics." }), (0, jsx_runtime_1.jsxs)("header", { className: "dashboard-panel dashboard-frame navbar flex flex-col gap-4 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin signal board" }), (0, jsx_runtime_1.jsx)("h1", { className: "dashboard-heading text-2xl font-bold", children: "rORE Stats Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Live protocol analytics and market data" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-chip rounded-xl px-4 py-3 text-xs", children: ["Last updated ", (0, jsx_runtime_1.jsx)(SkeletonBlock, { className: "ml-2 inline-flex h-4 w-28 align-middle" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsx)(SkeletonStatCard, { title: "Motherlode", showSubtitle: true }), (0, jsx_runtime_1.jsx)(SkeletonStatCard, { title: "WETH", showSubtitle: true }), (0, jsx_runtime_1.jsx)(SkeletonStatCard, { title: "rORE", showSubtitle: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(SkeletonChart, { title: "Market Snapshot", bars: [
                            { height: '100%' },
                            { height: '70%' },
                        ] }), (0, jsx_runtime_1.jsx)(SkeletonChart, { title: "Protocol Snapshot", bars: [
                            { height: '100%' },
                            { height: '78%' },
                            { height: '56%' },
                            { height: '68%' },
                            { height: '44%' },
                        ] })] }), (0, jsx_runtime_1.jsx)(SkeletonPanel, { kicker: "Burncoin reserves", title: "Motherlode", cardTitles: ['Total Value', 'ORE Locked', 'Participants'] }), (0, jsx_runtime_1.jsx)(SkeletonPanel, { kicker: "Burncoin countdown", title: "Current Round", cardTitles: ['Status', 'Prize Pool', 'Total Entries', 'Time Remaining'] })] }));
}
