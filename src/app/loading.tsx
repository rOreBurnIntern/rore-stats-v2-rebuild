function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-[var(--accent-soft)] ${className}`}
    />
  );
}

function SkeletonStatCard({
  title,
  showSubtitle = false,
}: {
  title: string;
  showSubtitle?: boolean;
}) {
  return (
    <div className="dashboard-card dashboard-frame card w-full min-w-0 rounded-xl p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="dashboard-subtle text-sm font-medium uppercase tracking-[0.18em]">{title}</h3>
        <span className="dashboard-ember mt-1 h-2.5 w-2.5 rounded-full" aria-hidden="true"></span>
      </div>
      <SkeletonBlock className="h-8 w-3/4" />
      {showSubtitle && <SkeletonBlock className="mt-3 h-4 w-full max-w-[14rem]" />}
    </div>
  );
}

function SkeletonChart({
  title,
  bars,
}: {
  title: string;
  bars: Array<{ height: string }>;
}) {
  return (
    <section className="dashboard-panel dashboard-frame rounded-2xl p-6" aria-label={`${title} loading state`}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase">Burncoin spread</p>
          <h3 className="dashboard-heading text-base font-semibold">{title}</h3>
          <SkeletonBlock className="mt-2 h-4 w-full max-w-sm" />
        </div>
        <SkeletonBlock className="h-7 w-44 rounded-full" />
      </div>

      <div className="interactive-chart" aria-hidden="true">
        <div className="interactive-chart__grid">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className="interactive-chart__bars">
          {bars.map((bar, index) => (
            <li key={`${title}-${index}`} className="interactive-chart__item">
              <div className="interactive-chart__bar-group">
                <div
                  className="interactive-chart__bar animate-pulse"
                  style={{
                    height: bar.height,
                    background: 'linear-gradient(180deg, rgba(255, 179, 71, 0.36), rgba(255, 138, 42, 0.14))',
                  }}
                />
              </div>
              <SkeletonBlock className="mx-auto mt-3 h-3 w-12" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SkeletonPanel({
  kicker,
  title,
  cardTitles,
}: {
  kicker: string;
  title: string;
  cardTitles: string[];
}) {
  return (
    <section className="dashboard-panel dashboard-frame rounded-2xl p-6">
      <p className="dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase">{kicker}</p>
      <h3 className="dashboard-heading mb-4 text-base font-semibold">{title}</h3>
      <div className={`grid grid-cols-1 gap-4 ${cardTitles.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {cardTitles.map((cardTitle) => (
          <SkeletonStatCard key={cardTitle} title={cardTitle} showSubtitle />
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard statistics.</span>

      <header className="dashboard-panel dashboard-frame navbar flex flex-col gap-4 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase">Burncoin signal board</p>
          <h1 className="dashboard-heading text-2xl font-bold">rORE Stats Dashboard</h1>
          <p className="dashboard-muted text-sm">Live protocol analytics and market data</p>
        </div>
        <div className="dashboard-chip rounded-xl px-4 py-3 text-xs">
          Last updated <SkeletonBlock className="ml-2 inline-flex h-4 w-28 align-middle" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SkeletonStatCard title="Motherlode" showSubtitle />
        <SkeletonStatCard title="WETH" showSubtitle />
        <SkeletonStatCard title="rORE" showSubtitle />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkeletonChart
          title="Market Snapshot"
          bars={[
            { height: '100%' },
            { height: '70%' },
          ]}
        />
        <SkeletonChart
          title="Protocol Snapshot"
          bars={[
            { height: '100%' },
            { height: '78%' },
            { height: '56%' },
            { height: '68%' },
            { height: '44%' },
          ]}
        />
      </div>

      <SkeletonPanel
        kicker="Burncoin reserves"
        title="Motherlode"
        cardTitles={['Total Value', 'ORE Locked', 'Participants']}
      />

      <SkeletonPanel
        kicker="Burncoin countdown"
        title="Current Round"
        cardTitles={['Status', 'Prize Pool', 'Total Entries', 'Time Remaining']}
      />
    </div>
  );
}
