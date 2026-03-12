"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WinnerTypePieChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend);
const WINNER_TYPE_COLORS = {
    split: '#ffd166',
    winnerTakeAll: '#ff8a2a',
};
function formatCount(value) {
    return value.toLocaleString(undefined, {
        maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    });
}
function WinnerTypePieChart({ winnerTakeAll, split }) {
    const total = winnerTakeAll + split;
    if (total <= 0) {
        return null;
    }
    const data = {
        labels: ['Winner Take All', 'Split'],
        datasets: [
            {
                data: [winnerTakeAll, split],
                backgroundColor: [WINNER_TYPE_COLORS.winnerTakeAll, WINNER_TYPE_COLORS.split],
                borderWidth: 0,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const percent = Math.round((value / total) * 100);
                        return `${context.label}: ${formatCount(value)} rounds (${percent}%)`;
                    },
                },
            },
        },
    };
    return ((0, jsx_runtime_1.jsxs)("section", { className: "dashboard-panel dashboard-frame rounded-2xl p-6", "aria-label": "Winner type distribution", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin outcomes" }), (0, jsx_runtime_1.jsx)("h3", { className: "dashboard-heading text-base font-semibold", children: "Winner Types" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Distribution of Winner Take All versus Split round outcomes." })] }), (0, jsx_runtime_1.jsxs)("p", { className: "dashboard-chart-note dashboard-subtle rounded-full px-3 py-1 text-xs", children: [formatCount(total), " total rounds"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "winner-type-chart", children: [(0, jsx_runtime_1.jsx)("figure", { className: "winner-type-chart__figure", "aria-label": "Winner type distribution", children: (0, jsx_runtime_1.jsx)("div", { style: { position: 'relative', height: '250px', width: '100%' }, children: (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Doughnut, { data: data, options: options }) }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "winner-type-chart__legend", children: [(0, jsx_runtime_1.jsxs)("li", { className: "winner-type-chart__legend-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "winner-type-chart__swatch", "aria-hidden": "true", style: { background: WINNER_TYPE_COLORS.winnerTakeAll } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-heading text-sm font-semibold", children: "Winner Take All" }), (0, jsx_runtime_1.jsxs)("p", { className: "dashboard-muted text-sm", children: [formatCount(winnerTakeAll), " rounds / ", Math.round((winnerTakeAll / total) * 100), "%"] })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "winner-type-chart__legend-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "winner-type-chart__swatch", "aria-hidden": "true", style: { background: WINNER_TYPE_COLORS.split } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-heading text-sm font-semibold", children: "Split" }), (0, jsx_runtime_1.jsxs)("p", { className: "dashboard-muted text-sm", children: [formatCount(split), " rounds / ", Math.round((split / total) * 100), "%"] })] })] })] })] })] }));
}
