"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorDisplay;
const jsx_runtime_1 = require("react/jsx-runtime");
function ErrorDisplay({ title = 'Stats unavailable', message, }) {
    return ((0, jsx_runtime_1.jsx)("section", { role: "alert", "aria-live": "polite", className: "dashboard-alert dashboard-frame alert rounded-2xl px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "dashboard-ember mt-1 h-2.5 w-2.5 rounded-full", "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("h2", { className: "dashboard-heading text-base font-semibold", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message })] })] }) }));
}
