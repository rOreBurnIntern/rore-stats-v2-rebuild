"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOTHERLODE_TIME_FILTERS = void 0;
exports.filterMotherlodeHistory = filterMotherlodeHistory;
exports.MOTHERLODE_TIME_FILTERS = ['24H', '7D', '30D'];
const FILTER_WINDOW_MS = {
    '24H': 24 * 60 * 60 * 1000,
    '7D': 7 * 24 * 60 * 60 * 1000,
    '30D': 30 * 24 * 60 * 60 * 1000,
};
function hasTimestamp(point) {
    return typeof point.timestamp === 'number' && Number.isFinite(point.timestamp);
}
function filterMotherlodeHistory(points, timeFilter) {
    const timestampedPoints = points.filter(hasTimestamp);
    if (timestampedPoints.length === 0) {
        return points;
    }
    const latestTimestamp = Math.max(...timestampedPoints.map((point) => point.timestamp));
    const windowStart = latestTimestamp - FILTER_WINDOW_MS[timeFilter];
    return timestampedPoints.filter((point) => point.timestamp >= windowStart);
}
