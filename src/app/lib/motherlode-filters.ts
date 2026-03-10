import type { MotherlodeHistoryPoint } from './motherlode';

export const MOTHERLODE_TIME_FILTERS = ['24H', '7D', '30D'] as const;
export type MotherlodeTimeFilter = (typeof MOTHERLODE_TIME_FILTERS)[number];

const FILTER_WINDOW_MS: Record<MotherlodeTimeFilter, number> = {
  '24H': 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
};

function hasTimestamp(point: MotherlodeHistoryPoint): point is MotherlodeHistoryPoint & { timestamp: number } {
  return typeof point.timestamp === 'number' && Number.isFinite(point.timestamp);
}

export function filterMotherlodeHistory(
  points: MotherlodeHistoryPoint[],
  timeFilter: MotherlodeTimeFilter
): MotherlodeHistoryPoint[] {
  const timestampedPoints = points.filter(hasTimestamp);

  if (timestampedPoints.length === 0) {
    return points;
  }

  const latestTimestamp = Math.max(...timestampedPoints.map((point) => point.timestamp));
  const windowStart = latestTimestamp - FILTER_WINDOW_MS[timeFilter];

  return timestampedPoints.filter((point) => point.timestamp >= windowStart);
}
