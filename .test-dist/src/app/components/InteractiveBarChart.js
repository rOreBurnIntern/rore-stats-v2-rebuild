"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InteractiveBarChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
const BAR_COLORS = ['#ff8a2a', '#ffb347', '#ff6b2c', '#ffd166', '#ff9f4a'];
function InteractiveBarChart({ title, subtitle, ariaLabel, points, note = 'Hover or focus a bar for exact values.', minColumnWidth = '3.5rem', maxBarWidth = '4.5rem', }) {
    const maxValue = Math.max(...points.map(p => p.value), 1);
    const data = {
        labels: points.map(p => p.label),
        datasets: [
            {
                label: title,
                data: points.map(p => p.value),
                backgroundColor: points.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]),
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: Math.max(points.length * 0.4, 1.5),
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#ff8a2a',
                bodyColor: '#fff',
                callbacks: {
                    label: (context) => {
                        const point = points[context.dataIndex];
                        return `${point.label}: ${point.formattedValue}${point.detail ? '. ' + point.detail : ''}`;
                    },
                },
            },
            title: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#999' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: {
                    callback: (value) => value.toLocaleString(),
                    color: '#999',
                },
                beginAtZero: true,
            },
        },
    };
    return ((0, jsx_runtime_1.jsxs)("section", { className: "dashboard-panel dashboard-frame rounded-2xl p-6", "aria-label": ariaLabel, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin spread" }), (0, jsx_runtime_1.jsx)("h3", { className: "dashboard-heading text-base font-semibold", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: subtitle })] }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-chart-note dashboard-subtle rounded-full px-3 py-1 text-xs", children: note })] }), (0, jsx_runtime_1.jsx)("div", { className: "interactive-chart", children: (0, jsx_runtime_1.jsx)("div", { style: { position: 'relative', height: '300px', width: '100%' }, children: (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Bar, { data: data, options: options }) }) })] }));
}
