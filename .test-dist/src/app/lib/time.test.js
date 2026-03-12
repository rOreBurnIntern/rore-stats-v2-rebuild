"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const time_1 = require("./time");
(0, node_test_1.default)('formats elapsed seconds', () => {
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 31000), '30 seconds ago');
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 2000), '1 second ago');
});
(0, node_test_1.default)('formats elapsed minutes', () => {
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 121000), '2 minutes ago');
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 61000), '1 minute ago');
});
(0, node_test_1.default)('formats elapsed hours', () => {
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 7201000), '2 hours ago');
    strict_1.default.equal((0, time_1.formatTimeAgo)(1000, 3601000), '1 hour ago');
});
(0, node_test_1.default)('clamps future timestamps to zero seconds ago', () => {
    strict_1.default.equal((0, time_1.formatTimeAgo)(10000, 9000), '0 seconds ago');
});
(0, node_test_1.default)('formats timestamps in UTC', () => {
    strict_1.default.equal((0, time_1.formatTimestamp)(Date.parse('2026-03-09T12:34:56.000Z')), 'Mar 9, 2026, 12:34:56 PM UTC');
});
