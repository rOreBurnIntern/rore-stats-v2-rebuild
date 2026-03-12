"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./globals.css");
exports.metadata = {
    title: "rORE Stats Dashboard",
    description: "Burncoin-inspired dark dashboard for rORE protocol analytics.",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "en", "data-theme": "coffee", children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("link", { rel: "stylesheet", href: "/vendor/daisyui/themes.css" }), (0, jsx_runtime_1.jsx)("link", { rel: "stylesheet", href: "/vendor/daisyui/styled.css" })] }), (0, jsx_runtime_1.jsx)("body", { className: "bg-base-200 text-base-content antialiased", children: (0, jsx_runtime_1.jsxs)("div", { className: "app-shell dashboard-burncoin-shell flex min-h-screen flex-col overflow-x-auto bg-base-200 font-sans", children: [(0, jsx_runtime_1.jsx)("header", { className: "dashboard-shell-header border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "dashboard-accent text-xs font-semibold uppercase tracking-[0.3em]", children: "rORE Protocol" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-muted text-sm", children: "Stats dashboard" })] }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-chip rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em]", children: "Burncoin Dark Theme" })] }) }), (0, jsx_runtime_1.jsx)("main", { className: "dashboard-main flex-1", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto flex w-full max-w-7xl min-w-0 flex-col px-4 py-8", children: children }) }), (0, jsx_runtime_1.jsx)("footer", { className: "dashboard-footer border-t border-white/10", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto w-full max-w-7xl min-w-0 px-4 py-4 text-center text-sm", children: "Data sourced from rORE Protocol API" }) })] }) })] }));
}
