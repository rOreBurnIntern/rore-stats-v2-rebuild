"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function getTrendDirection(change) {
    const normalizedChange = change.trim();
    if (normalizedChange.startsWith('+')) {
        return 'up';
    }
    if (normalizedChange.startsWith('-')) {
        return 'down';
    }
    return null;
}
function StatCard({ title, value, valueLabel, subtitle, change, isCurrency = false, loading = false, }) {
    const trendDirection = change ? getTrendDirection(change) : null;
    const trendClassName = trendDirection === 'up'
        ? 'text-green-500'
        : trendDirection === 'down'
            ? 'text-red-400'
            : 'dashboard-muted';
    const trendIcon = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card dashboard-frame card w-full min-w-0 rounded-xl p-6 transition-all hover:-translate-y-0.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "dashboard-subtle text-sm font-medium uppercase tracking-[0.18em]", children: title }), (0, jsx_runtime_1.jsx)("span", { className: "dashboard-ember mt-1 h-2.5 w-2.5 rounded-full", "aria-hidden": "true" })] }), loading ? ((0, jsx_runtime_1.jsx)("div", { className: "h-8 animate-pulse rounded bg-[var(--accent-soft)]" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "dashboard-heading break-words text-2xl font-semibold", children: [isCurrency ? '$' : '', value] }), valueLabel && ((0, jsx_runtime_1.jsx)("span", { className: "dashboard-muted text-sm font-medium", children: valueLabel })), change && ((0, jsx_runtime_1.jsxs)("p", { className: `flex items-center gap-1 text-sm font-medium ${trendClassName}`, "aria-label": trendDirection ? `${trendDirection} trend ${change}` : `trend ${change}`, children: [trendIcon && (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: trendIcon }), change] }))] })), subtitle && (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted mt-1 text-sm", children: subtitle })] }));
}
