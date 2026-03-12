"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const ProtocolStatCards_1 = __importDefault(require("./ProtocolStatCards"));
(0, node_test_1.default)('renders the rORE price as USD with a dollar prefix', () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(ProtocolStatCards_1.default, { statsData: {
            wethPrice: 3210.45,
            rorePrice: 0.688759,
            motherlode: {
                totalValue: 1.2345,
                totalORELocked: 43210,
                participants: 246,
            },
            currentRound: {
                number: 12,
                status: 'active',
                prize: 777,
                entries: 88,
                endTime: Date.parse('2026-03-09T12:44:56.000Z'),
            },
            lastUpdated: Date.parse('2026-03-09T12:34:56.000Z'),
        } }));
    strict_1.default.match(markup, />rORE</);
    strict_1.default.match(markup, /\$0\.688759/);
    strict_1.default.match(markup, /Current upstream rORE spot price in USD\./);
    strict_1.default.doesNotMatch(markup, />0\.688759<\/p>/);
});
