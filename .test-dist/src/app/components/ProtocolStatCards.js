"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtocolStatCards;
const jsx_runtime_1 = require("react/jsx-runtime");
const StatCard_1 = __importDefault(require("./StatCard"));
function formatTokenAmount(value) {
    return value.toLocaleString(undefined, {
        maximumFractionDigits: 4,
    });
}
function formatFixed(value, fractionDigits) {
    return value.toFixed(fractionDigits);
}
function formatNumber(value) {
    return value.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    });
}
function ProtocolStatCards({ statsData }) {
    const motherlodeSubtitle = statsData
        ? `${formatNumber(statsData.motherlode.totalORELocked)} ORE locked across ${formatNumber(statsData.motherlode.participants)} participants`
        : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "Motherlode", value: statsData ? formatTokenAmount(statsData.motherlode.totalValue) : '—', valueLabel: "rORE", subtitle: motherlodeSubtitle, loading: !statsData }), (0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "WETH", value: statsData ? formatFixed(statsData.wethPrice, 2) : '—', subtitle: "Current upstream WETH spot price in USD.", isCurrency: true, loading: !statsData }), (0, jsx_runtime_1.jsx)(StatCard_1.default, { title: "rORE", value: statsData ? formatFixed(statsData.rorePrice, 6) : '—', subtitle: "Current upstream rORE spot price in USD.", isCurrency: true, loading: !statsData })] }));
}
