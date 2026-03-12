"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const motherlode_filters_1 = require("./motherlode-filters");
(0, node_test_1.default)('returns all points unchanged when timestamps are unavailable', () => {
    const points = [
        { label: 'R10', value: 0.4 },
        { label: 'R11', value: 0.6 },
        { label: 'R12', value: 0.8 },
    ];
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '24H'), points);
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '7D'), points);
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '30D'), points);
});
(0, node_test_1.default)('filters points by the selected window using the latest history timestamp as reference', () => {
    const points = [
        { label: 'Old', value: 0.2, timestamp: Date.parse('2026-02-01T00:00:00.000Z') },
        { label: '8d', value: 0.4, timestamp: Date.parse('2026-03-02T00:00:00.000Z') },
        { label: '2d', value: 0.6, timestamp: Date.parse('2026-03-08T00:00:00.000Z') },
        { label: 'Latest', value: 0.8, timestamp: Date.parse('2026-03-10T00:00:00.000Z') },
    ];
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '24H'), [{ label: 'Latest', value: 0.8, timestamp: Date.parse('2026-03-10T00:00:00.000Z') }]);
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '7D'), [
        { label: '2d', value: 0.6, timestamp: Date.parse('2026-03-08T00:00:00.000Z') },
        { label: 'Latest', value: 0.8, timestamp: Date.parse('2026-03-10T00:00:00.000Z') },
    ]);
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '30D'), points.slice(1));
});
(0, node_test_1.default)('drops non-timestamped entries when timestamp filtering is active', () => {
    const points = [
        { label: 'NoTime', value: 0.2 },
        { label: 'Timed', value: 0.4, timestamp: Date.parse('2026-03-10T00:00:00.000Z') },
    ];
    strict_1.default.deepEqual((0, motherlode_filters_1.filterMotherlodeHistory)(points, '24H'), [
        { label: 'Timed', value: 0.4, timestamp: Date.parse('2026-03-10T00:00:00.000Z') },
    ]);
});
