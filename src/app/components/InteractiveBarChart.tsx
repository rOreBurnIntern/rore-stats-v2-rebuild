interface InteractiveBarChartPoint {
  label: string;
  value: number;
  formattedValue: string;
  detail?: string;
}

interface InteractiveBarChartProps {
  title: string;
  subtitle: string;
  ariaLabel: string;
  points: InteractiveBarChartPoint[];
}

const BAR_COLORS = ['#ff9b45', '#ffc16b', '#ff7a45', '#ffb347', '#ffd39a'];

export default function InteractiveBarChart({
  title,
  subtitle,
  ariaLabel,
  points,
}: InteractiveBarChartProps) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <section className="dashboard-panel rounded-2xl p-6" aria-label={ariaLabel}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="dashboard-heading text-base font-semibold">{title}</h3>
          <p className="dashboard-muted text-sm">{subtitle}</p>
        </div>
        <p className="dashboard-subtle text-xs">Hover or focus a bar for exact values.</p>
      </div>

      <div className="interactive-chart">
        <div className="interactive-chart__grid" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className="interactive-chart__bars">
          {points.map((point, index) => {
            const barHeight = point.value > 0 ? `${Math.max((point.value / maxValue) * 100, 12)}%` : '4%';
            const tooltipLabel = point.detail
              ? `${point.label}: ${point.formattedValue}. ${point.detail}`
              : `${point.label}: ${point.formattedValue}`;

            return (
              <li key={point.label} className="interactive-chart__item">
                <div className="interactive-chart__bar-group">
                  <button
                    type="button"
                    className="interactive-chart__bar"
                    aria-label={tooltipLabel}
                    style={{
                      height: barHeight,
                      background: `linear-gradient(180deg, ${BAR_COLORS[index % BAR_COLORS.length]}, rgba(255, 155, 69, 0.22))`,
                    }}
                  >
                    <span className="sr-only">{tooltipLabel}</span>
                  </button>
                  <div className="interactive-chart__tooltip" role="tooltip">
                    <p className="dashboard-heading text-sm font-semibold">{point.label}</p>
                    <p className="dashboard-accent text-sm">{point.formattedValue}</p>
                    {point.detail && <p className="dashboard-muted text-xs">{point.detail}</p>}
                  </div>
                </div>
                <p className="dashboard-subtle mt-3 text-center text-xs">{point.label}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
