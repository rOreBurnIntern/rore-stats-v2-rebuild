"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MotherlodeCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const motherlode_filters_1 = require("../lib/motherlode-filters");
const MotherlodeLineChart_1 = __importDefault(require("./MotherlodeLineChart"));
const StatCard_1 = __importDefault(require("./StatCard"));
function MotherlodeCard({ totalValue, totalORELocked, participants, history = [], }) {
    const [timeFilter, setTimeFilter] = (0, react_1.useState)('7D');
    const hasTimestampedHistory = history.some((point) => typeof point.timestamp === 'number');
    const filteredHistory = (0, react_1.useMemo)(() => (0, motherlode_filters_1.filterMotherlodeHistory)(history, timeFilter), [history, timeFilter]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-panel dashboard-frame rounded-2xl p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase", children: "Burncoin reserves" }), (0, jsx_runtime_1.jsx)("h3", { className: "dashboard-heading mb-4 text-base font-semibold", children: "Motherlode" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [(0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "Amount", value: totalValue !== null ? totalValue.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—', valueLabel: "rORE", subtitle: "Locked" }), (0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "ORE Locked", value: totalORELocked !== null ? totalORELocked.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—', valueLabel: "ORE" }), (0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "Participants", value: participants !== null ? participants.toLocaleString() : '—', subtitle: "Active" })] }), hasTimestampedHistory && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 flex items-center justify-end gap-2", role: "group", "aria-label": "Motherlode history time filters", children: motherlode_filters_1.MOTHERLODE_TIME_FILTERS.map((filterOption) => {
                    const isActive = filterOption === timeFilter;
                    return ((0, jsx_runtime_1.jsx)("button", { type: "button", "aria-pressed": isActive, className: `dashboard-chip rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] transition ${isActive
                            ? 'border-orange-300/70 bg-orange-300/20 text-orange-100'
                            : 'border-orange-400/25 bg-orange-400/10 text-[var(--text-muted)] hover:border-orange-300/50 hover:text-orange-100'}`, onClick: () => setTimeFilter(filterOption), children: filterOption }, filterOption));
                }) })), (0, jsx_runtime_1.jsx)(MotherlodeLineChart_1.default, { points: filteredHistory })] }));
}
