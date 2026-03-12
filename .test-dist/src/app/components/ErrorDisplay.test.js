"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const ErrorDisplay_1 = __importDefault(require("./ErrorDisplay"));
(0, node_test_1.default)('renders the error display with default title and alert semantics', () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(ErrorDisplay_1.default, { message: "We could not load the latest stats right now. Please try again in a few minutes." }));
    strict_1.default.match(markup, /role="alert"/);
    strict_1.default.match(markup, /aria-live="polite"/);
    strict_1.default.match(markup, /Stats unavailable/);
    strict_1.default.match(markup, /We could not load the latest stats right now\. Please try again in a few minutes\./);
    strict_1.default.match(markup, /class="[^"]*dashboard-alert[^"]*dashboard-frame[^"]*alert[^"]*"/);
    strict_1.default.match(markup, /dashboard-ember/);
});
(0, node_test_1.default)('renders a custom title when one is provided', () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(ErrorDisplay_1.default, { title: "Network issue", message: "The upstream API is temporarily unavailable." }));
    strict_1.default.match(markup, /Network issue/);
    strict_1.default.match(markup, /The upstream API is temporarily unavailable\./);
});
