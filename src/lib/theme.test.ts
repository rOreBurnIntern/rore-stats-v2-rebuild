import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyChartDefaults,
  CHART_COLORS,
  CHART_SURFACE,
  THEME_COLORS,
  withOpacity,
} from './theme';

test('exports the approved P1-2 theme palette', () => {
  assert.deepEqual(THEME_COLORS, {
    primary: '#ff6b00',
    secondary: '#ff3d00',
    motherlode: '#ffb15c',
    text: '#fff3e8',
  });
});

test('derives chart colors from the shared palette', () => {
  assert.equal(CHART_COLORS[0], THEME_COLORS.primary);
  assert.equal(CHART_COLORS[1], THEME_COLORS.secondary);
  assert.equal(CHART_COLORS[2], THEME_COLORS.motherlode);
  assert.equal(CHART_SURFACE.fill, 'rgba(255, 107, 0, 0.18)');
  assert.equal(CHART_SURFACE.tooltipBorder, 'rgba(255, 177, 92, 0.36)');
  assert.equal(withOpacity(THEME_COLORS.text, 0.66), 'rgba(255, 243, 232, 0.66)');
});

test('applies shared Chart.js defaults', () => {
  const chartStub = {
    defaults: {
      color: '',
      borderColor: '',
    },
  };

  applyChartDefaults(chartStub as never);

  assert.equal(chartStub.defaults.color, CHART_SURFACE.tick);
  assert.equal(chartStub.defaults.borderColor, CHART_SURFACE.grid);
});
