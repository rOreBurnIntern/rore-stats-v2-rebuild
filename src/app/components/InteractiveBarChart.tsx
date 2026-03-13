'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { applyChartDefaults, CHART_COLORS, CHART_SURFACE, THEME_COLORS } from '../../lib/theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
applyChartDefaults(ChartJS);

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
  note?: string;
  minColumnWidth?: string;
  maxBarWidth?: string;
}

export default function InteractiveBarChart({
  title,
  subtitle,
  ariaLabel,
  points,
  note = 'Hover or focus a bar for exact values.',
  minColumnWidth = '3.5rem',
  maxBarWidth = '4.5rem',
}: InteractiveBarChartProps) {
  const data = {
    labels: points.map(p => p.label),
    datasets: [
      {
        label: title,
        data: points.map(p => p.value),
        backgroundColor: points.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: Math.max(points.length * 0.4, 1.5),
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: CHART_SURFACE.tooltipBackground,
        borderColor: CHART_SURFACE.tooltipBorder,
        borderWidth: 1,
        titleColor: THEME_COLORS.motherlode,
        bodyColor: THEME_COLORS.text,
        callbacks: {
          label: (context: any) => {
            const point = points[context.dataIndex];
            return `${point.label}: ${point.formattedValue}${point.detail ? '. ' + point.detail : ''}`;
          },
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: CHART_SURFACE.tick },
      },
      y: {
        grid: { color: CHART_SURFACE.grid },
        ticks: {
          callback: (value: any) => value.toLocaleString(),
          color: CHART_SURFACE.tick,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="dashboard-panel dashboard-frame rounded-2xl p-6" aria-label={ariaLabel}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dashboard-kicker mb-2 text-[0.65rem] font-semibold uppercase">Protocol activity</p>
          <h3 className="dashboard-heading text-base font-semibold">{title}</h3>
          <p className="dashboard-muted text-sm">{subtitle}</p>
        </div>
        <p className="dashboard-chart-note dashboard-subtle rounded-full px-3 py-1 text-xs">
          {note}
        </p>
      </div>

      <div className="interactive-chart">
        <div style={{ position: 'relative', height: '300px', width: '100%' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
