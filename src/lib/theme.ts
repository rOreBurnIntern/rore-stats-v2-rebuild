import type { Chart } from 'chart.js';

export const THEME_COLORS = {
  primary: '#ff6b00',
  secondary: '#ff3d00',
  motherlode: '#ffb15c',
  text: '#fff3e8',
} as const;

export function withOpacity(hexColor: string, opacity: number) {
  const normalizedColor = hexColor.replace('#', '');
  const [red, green, blue] = normalizedColor.length === 3
    ? normalizedColor.split('').map((value) => Number.parseInt(value.repeat(2), 16))
    : [
        normalizedColor.slice(0, 2),
        normalizedColor.slice(2, 4),
        normalizedColor.slice(4, 6),
      ].map((value) => Number.parseInt(value, 16));

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export const CHART_COLORS = [
  THEME_COLORS.primary,
  THEME_COLORS.secondary,
  THEME_COLORS.motherlode,
  withOpacity(THEME_COLORS.primary, 0.8),
  withOpacity(THEME_COLORS.secondary, 0.72),
] as const;

export const CHART_SURFACE = {
  fill: withOpacity(THEME_COLORS.primary, 0.18),
  grid: withOpacity(THEME_COLORS.text, 0.08),
  tick: withOpacity(THEME_COLORS.text, 0.66),
  tooltipBackground: withOpacity(THEME_COLORS.secondary, 0.9),
  tooltipBorder: withOpacity(THEME_COLORS.motherlode, 0.36),
} as const;

export function applyChartDefaults(chart: typeof Chart) {
  chart.defaults.color = CHART_SURFACE.tick;
  chart.defaults.borderColor = CHART_SURFACE.grid;
}
