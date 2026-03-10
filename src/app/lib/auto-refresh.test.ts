import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AUTO_REFRESH_INTERVAL_MS,
  AUTO_REFRESH_MONITOR_DURATION_MS,
  scheduleAutoRefresh,
} from './auto-refresh';

test('schedules a page reload every 30 seconds, monitors for 24 hours, and clears both timers on cleanup', () => {
  let scheduledHandler: (() => void) | undefined;
  let scheduledTimeout: number | undefined;
  let scheduledMonitorHandler: (() => void) | undefined;
  let scheduledMonitorTimeout: number | undefined;
  let clearedIntervalId: unknown;
  let clearedTimeoutId: unknown;
  let reloadCount = 0;
  const intervalId = {};
  const timeoutId = {};

  const cleanup = scheduleAutoRefresh({
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

  assert.equal(scheduledTimeout, AUTO_REFRESH_INTERVAL_MS);
  assert.equal(scheduledMonitorTimeout, AUTO_REFRESH_MONITOR_DURATION_MS);
  assert.ok(scheduledHandler);
  assert.ok(scheduledMonitorHandler);

  scheduledHandler();
  assert.equal(reloadCount, 1);

  cleanup();
  assert.equal(clearedIntervalId, intervalId);
  assert.equal(clearedTimeoutId, timeoutId);
});

test('stops refreshing when the monitor duration elapses', () => {
  let scheduledMonitorHandler: (() => void) | undefined;
  const intervalId = {};
  const clearedIntervalIds: unknown[] = [];

  scheduleAutoRefresh({
    clearInterval(interval) {
      clearedIntervalIds.push(interval);
    },
    location: {
      reload() {},
    },
    setInterval() {
      return intervalId;
    },
    setTimeout(handler) {
      scheduledMonitorHandler = handler;
      return {};
    },
  });

  assert.ok(scheduledMonitorHandler);
  scheduledMonitorHandler();
  assert.deepEqual(clearedIntervalIds, [intervalId]);
});
