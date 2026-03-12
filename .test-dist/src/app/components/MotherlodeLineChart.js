"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MotherlodeLineChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
const chartjs_plugin_zoom_1 = __importDefault(require("chartjs-plugin-zoom"));
chart_js_1.Chart.register(chartjs_plugin_zoom_1.default, chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.Filler);
function MotherlodeLineChart({ points = [] }) {
    const chartRef = (0, react_1.useRef)(null);
    if (points.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "motherlode-trend mt-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "dashboard-heading text-sm font-semibold", children: "Motherlode Over Time" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Recent total value history in rORE." })] }) }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Motherlode history is not available." })] }));
    }
    const data = {
        labels: points.map(p => p.label),
        datasets: [
            {
                label: 'Total Value (rORE)',
                data: points.map(p => p.value),
                borderColor: '#ff8a2a',
                backgroundColor: 'rgba(255, 138, 42, 0.1)',
                fill: true,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
            legend: { display: false },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#ff8a2a',
                bodyColor: '#fff',
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y;
                        return `${value.toLocaleString(undefined, { maximumFractionDigits: 4 })} rORE`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { maxTicksLimit: 8, color: '#999' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: {
                    callback: (value) => value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                    color: '#999',
                },
            },
        },
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "motherlode-trend mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "dashboard-heading text-sm font-semibold", children: "Motherlode Over Time" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Total value history in rORE." })] }), (0, jsx_runtime_1.jsxs)("p", { className: "dashboard-chart-note dashboard-subtle rounded-full px-3 py-1 text-xs", children: [points.length, " points"] })] }), (0, jsx_runtime_1.jsxs)("figure", { className: "motherlode-trend__figure", "aria-label": "Motherlode over time line chart", children: [(0, jsx_runtime_1.jsx)("div", { style: { position: 'relative', height: '300px', width: '100%' }, children: (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Line, { ref: chartRef, data: data, options: options }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "mt-2 text-xs text-orange-400 hover:text-orange-300", onClick: () => {
                            if (chartRef.current) {
                                // @ts-ignore
                                chartRef.current.resetZoom();
                            }
                        }, children: "Reset Zoom" })] }), (0, jsx_runtime_1.jsx)("ul", { className: "sr-only", children: points.map((point) => ((0, jsx_runtime_1.jsxs)("li", { children: [point.label, ": ", point.value.toLocaleString(undefined, { maximumFractionDigits: 4 }), " rORE"] }, `sr-${point.label}-${point.value}`))) })] }));
}
