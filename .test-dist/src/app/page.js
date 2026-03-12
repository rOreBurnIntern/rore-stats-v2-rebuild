"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
const DashboardHeader_1 = __importDefault(require("./components/DashboardHeader"));
const ErrorDisplay_1 = __importDefault(require("./components/ErrorDisplay"));
const InteractiveBarChart_1 = __importDefault(require("./components/InteractiveBarChart"));
const ProtocolStatCards_1 = __importDefault(require("./components/ProtocolStatCards"));
const WinnerTypePieChart_1 = __importDefault(require("./components/WinnerTypePieChart"));
const MotherlodeLineChart_1 = __importDefault(require("./components/MotherlodeLineChart"));
exports.dynamic = 'force-dynamic';
async function Home() {
    var _a, _b;
    const res = await fetch('/api/stats', { next: { revalidate: 0 } });
    const statsData = res.ok ? await res.json() : null;
    const lastUpdatedAt = (_a = statsData === null || statsData === void 0 ? void 0 : statsData.lastUpdated) !== null && _a !== void 0 ? _a : null;
    const blockPerformanceChartPoints = (statsData === null || statsData === void 0 ? void 0 : statsData.blockPerformance)
        ? statsData.blockPerformance.map((point) => ({
            label: point.block.toString(),
            value: point.wins,
            formattedValue: point.wins.toLocaleString(undefined, { maximumFractionDigits: 0 }),
            detail: `Completed wins ending on block ${point.block}.`,
        }))
        : [];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8", children: [(0, jsx_runtime_1.jsx)(DashboardHeader_1.default, { lastUpdatedAt: lastUpdatedAt }), !statsData && ((0, jsx_runtime_1.jsx)(ErrorDisplay_1.default, { message: "We could not load the latest stats right now. Please try again in a few minutes." })), (0, jsx_runtime_1.jsx)(ProtocolStatCards_1.default, { statsData: statsData }), statsData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [blockPerformanceChartPoints.length > 0 && ((0, jsx_runtime_1.jsx)(InteractiveBarChart_1.default, { title: "Block Performance", subtitle: "Completed wins grouped by ending block for blocks 1 through 25.", ariaLabel: "Block performance bar chart for wins per block 1 through 25", note: "Hover or focus a bar for exact values. Scroll to view all 25 blocks.", minColumnWidth: "2.5rem", maxBarWidth: "2.5rem", points: blockPerformanceChartPoints })), statsData.winnerTypes && ((0, jsx_runtime_1.jsx)(WinnerTypePieChart_1.default, { winnerTakeAll: statsData.winnerTypes.winnerTakeAll, split: statsData.winnerTypes.split }))] }), statsData.motherlode && ((0, jsx_runtime_1.jsx)(MotherlodeLineChart_1.default, { points: (_b = statsData.motherlode.history) !== null && _b !== void 0 ? _b : [] }))] }))] }));
}
