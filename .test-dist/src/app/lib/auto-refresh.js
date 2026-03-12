"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTO_REFRESH_MONITOR_DURATION_MS = exports.AUTO_REFRESH_INTERVAL_MS = void 0;
exports.scheduleAutoRefresh = scheduleAutoRefresh;
exports.AUTO_REFRESH_INTERVAL_MS = 30000;
exports.AUTO_REFRESH_MONITOR_DURATION_MS = 24 * 60 * 60 * 1000;
function scheduleAutoRefresh(refreshWindow, intervalMs = exports.AUTO_REFRESH_INTERVAL_MS, monitorDurationMs = exports.AUTO_REFRESH_MONITOR_DURATION_MS) {
    const intervalId = refreshWindow.setInterval(() => {
        refreshWindow.location.reload();
    }, intervalMs);
    const timeoutId = monitorDurationMs > 0 && typeof refreshWindow.setTimeout === 'function'
        ? refreshWindow.setTimeout(() => {
            refreshWindow.clearInterval(intervalId);
        }, monitorDurationMs)
        : null;
    return () => {
        refreshWindow.clearInterval(intervalId);
        if (timeoutId !== null && typeof refreshWindow.clearTimeout === 'function') {
            refreshWindow.clearTimeout(timeoutId);
        }
    };
}
