export const AUTO_REFRESH_INTERVAL_MS = 30_000;

interface RefreshWindow {
  clearInterval(intervalId: unknown): void;
  location: {
    reload(): void;
  };
  setInterval(handler: () => void, timeout?: number): unknown;
}

export function scheduleAutoRefresh(
  refreshWindow: RefreshWindow,
  intervalMs = AUTO_REFRESH_INTERVAL_MS
) {
  const intervalId = refreshWindow.setInterval(() => {
    refreshWindow.location.reload();
  }, intervalMs);

  return () => {
    refreshWindow.clearInterval(intervalId);
  };
}
