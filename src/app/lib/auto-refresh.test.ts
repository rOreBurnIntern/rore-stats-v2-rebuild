import assert from 'node:assert/strict';
import test from 'node:test';

import { AUTO_REFRESH_INTERVAL_MS, scheduleAutoRefresh } from './auto-refresh';

test('schedules a page reload every 30 seconds and clears it on cleanup', () => {
  let scheduledHandler: (() => void) | undefined;
  let scheduledTimeout: number | undefined;
  let clearedIntervalId: unknown;
  let reloadCount = 0;
  const intervalId = {};

  const cleanup = scheduleAutoRefresh({
    clearInterval(interval) {
      clearedIntervalId = interval;
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
  });

  assert.equal(scheduledTimeout, AUTO_REFRESH_INTERVAL_MS);
  assert.ok(scheduledHandler);

  scheduledHandler();
  assert.equal(reloadCount, 1);

  cleanup();
  assert.equal(clearedIntervalId, intervalId);
});
