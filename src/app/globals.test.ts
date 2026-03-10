import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const globalsSource = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

test('defines the Burncoin dark theme tokens and shell overlays', () => {
  assert.match(globalsSource, /--background:\s*#090402;/);
  assert.match(globalsSource, /--accent:\s*#ff8a2a;/);
  assert.match(globalsSource, /color-scheme:\s*dark;/);
  assert.match(globalsSource, /\.dashboard-burncoin-shell::before/);
  assert.match(globalsSource, /\.dashboard-burncoin-shell::after/);
  assert.match(globalsSource, /\.dashboard-chip/);
  assert.match(globalsSource, /\.dashboard-ember/);
});
