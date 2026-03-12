"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const next_config_js_1 = __importDefault(require("./next.config.js"));
(0, node_test_1.default)('does not rely on Next.js 16-only experimental webpack settings', () => {
    strict_1.default.equal('experimental' in next_config_js_1.default, false);
});
