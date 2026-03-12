"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const auto_refresh_1 = require("./auto-refresh");
(0, node_test_1.default)('schedules a page reload every 30 seconds, monitors for 24 hours, and clears both timers on cleanup', () => {
    let scheduledHandler;
    let scheduledTimeout;
    let scheduledMonitorHandler;
    let scheduledMonitorTimeout;
    let clearedIntervalId;
    let clearedTimeoutId;
    let reloadCount = 0;
    const intervalId = {};
    const timeoutId = {};
    const cleanup = (0, auto_refresh_1.scheduleAutoRefresh)({
        clearInterval(interval) {
            clearedIntervalId = interval;
        },
        clearTimeout(timeout) {
            clearedTimeoutId = timeout;
        },
        location: {
            reload() {
                reloadCount += 1;
            },
        },
        setInterval(handler, timeout) {
            scheduledHandler = handler;
            scheduledTimeout = timeout;
            return intervalId;
        },
        setTimeout(handler, timeout) {
            scheduledMonitorHandler = handler;
            scheduledMonitorTimeout = timeout;
            return timeoutId;
        },
    });
    strict_1.default.equal(scheduledTimeout, auto_refresh_1.AUTO_REFRESH_INTERVAL_MS);
    strict_1.default.equal(scheduledMonitorTimeout, auto_refresh_1.AUTO_REFRESH_MONITOR_DURATION_MS);
    strict_1.default.ok(scheduledHandler);
    strict_1.default.ok(scheduledMonitorHandler);
    scheduledHandler();
    strict_1.default.equal(reloadCount, 1);
    cleanup();
    strict_1.default.equal(clearedIntervalId, intervalId);
    strict_1.default.equal(clearedTimeoutId, timeoutId);
});
(0, node_test_1.default)('stops refreshing when the monitor duration elapses', () => {
    let scheduledMonitorHandler;
    const intervalId = {};
    const clearedIntervalIds = [];
    (0, auto_refresh_1.scheduleAutoRefresh)({
        clearInterval(interval) {
            clearedIntervalIds.push(interval);
        },
        location: {
            reload() { },
        },
        setInterval() {
            return intervalId;
        },
        setTimeout(handler) {
            scheduledMonitorHandler = handler;
            return {};
        },
    });
    strict_1.default.ok(scheduledMonitorHandler);
    scheduledMonitorHandler();
    strict_1.default.deepEqual(clearedIntervalIds, [intervalId]);
});
