export const AUTO_REFRESH_INTERVAL_MS = 30_000;
export const AUTO_REFRESH_MONITOR_DURATION_MS = 24 * 60 * 60 * 1000;

interface RefreshWindow {
  clearInterval(intervalId: unknown): void;
  clearTimeout?(timeoutId: unknown): void;
  location: {
    reload(): void;
  };
  setInterval(handler: () => void, timeout?: number): unknown;
  setTimeout?(handler: () => void, timeout?: number): unknown;
}

export function scheduleAutoRefresh(
  refreshWindow: RefreshWindow,
  intervalMs = AUTO_REFRESH_INTERVAL_MS,
  monitorDurationMs = AUTO_REFRESH_MONITOR_DURATION_MS
) {
  const intervalId = refreshWindow.setInterval(() => {
    refreshWindow.location.reload();
  }, intervalMs);
  const timeoutId =
    monitorDurationMs > 0 && typeof refreshWindow.setTimeout === 'function'
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
