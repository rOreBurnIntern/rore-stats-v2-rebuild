'use client';

import { useMemo, useState } from 'react';

import type { MotherlodeHistoryPoint } from '../lib/motherlode';
import {
  filterMotherlodeHistory,
  MOTHERLODE_TIME_FILTERS,
  type MotherlodeTimeFilter,
} from '../lib/motherlode-filters';

import MotherlodeLineChart from './MotherlodeLineChart';
import StatCard from './StatCard';

interface MotherlodeCardProps {
  totalValue: number | null;
  totalORELocked: number | null;
  participants: number | null;
  history?: MotherlodeHistoryPoint[];
}

export default function MotherlodeCard({
  totalValue,
  totalORELocked,
  participants,
  history = [],
}: MotherlodeCardProps) {
  const [timeFilter, setTimeFilter] = useState<MotherlodeTimeFilter>('7D');
  const hasTimestampedHistory = history.some((point) => typeof point.timestamp === 'number');
  const filteredHistory = useMemo(
    () => filterMotherlodeHistory(history, timeFilter),
    [history, timeFilter]
  );

  return (
    <div className="dashboard-panel dashboard-frame rounded-2xl p-6">
      <p className="dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase">Burncoin reserves</p>
      <h3 className="dashboard-heading mb-4 text-base font-semibold">Motherlode</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard 
          title="Amount" 
          value={totalValue !== null ? totalValue.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'} 
          valueLabel="rORE" 
          subtitle="Locked" 
        />
        <StatCard 
          title="ORE Locked" 
          value={totalORELocked !== null ? totalORELocked.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'} 
          valueLabel="ORE" 
        />
        <StatCard 
          title="Participants" 
          value={participants !== null ? participants.toLocaleString() : '—'} 
          subtitle="Active" 
        />
      </div>

      {hasTimestampedHistory && (
        <div className="mt-6 flex items-center justify-end gap-2" role="group" aria-label="Motherlode history time filters">
          {MOTHERLODE_TIME_FILTERS.map((filterOption) => {
            const isActive = filterOption === timeFilter;

            return (
              <button
                key={filterOption}
                type="button"
                aria-pressed={isActive}
                className={`dashboard-chip rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] transition ${
                  isActive
                    ? 'border-theme-motherlode/70 bg-theme-motherlode/20 text-theme-text'
                    : 'border-theme-primary/25 bg-theme-primary/10 text-[var(--text-muted)] hover:border-theme-motherlode/50 hover:text-theme-text'
                }`}
                onClick={() => setTimeFilter(filterOption)}
              >
                {filterOption}
              </button>
            );
          })}
        </div>
      )}

      <MotherlodeLineChart points={filteredHistory} />
    </div>
  );
}
