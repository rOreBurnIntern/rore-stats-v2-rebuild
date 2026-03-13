import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const globalsSource = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

test('defines the rORE dashboard theme tokens and shell overlays', () => {
  assert.match(globalsSource, /--color-primary:\s*#ff6b00;/);
  assert.match(globalsSource, /--color-secondary:\s*#ff3d00;/);
  assert.match(globalsSource, /--color-motherlode:\s*#ffb15c;/);
  assert.match(globalsSource, /--color-text:\s*#fff3e8;/);
  assert.match(globalsSource, /--foreground:\s*var\(--color-text\);/);
  assert.match(globalsSource, /--accent:\s*var\(--color-primary\);/);
  assert.match(globalsSource, /color-scheme:\s*dark;/);
  assert.match(globalsSource, /radial-gradient\(circle at top, var\(--page-background-glow\), transparent 30%\)/);
  assert.match(globalsSource, /\.dashboard-rore-shell::before/);
  assert.match(globalsSource, /\.dashboard-rore-shell::after/);
  assert.match(globalsSource, /\.dashboard-chip/);
  assert.match(globalsSource, /\.dashboard-ember/);
});

test('defines responsive breakpoints for mobile and desktop chart layouts', () => {
  assert.match(globalsSource, /@media \(max-width:\s*640px\)/);
  assert.match(
    globalsSource,
    /@media \(max-width:\s*640px\)\s*{[\s\S]*\.interactive-chart\s*{[\s\S]*min-height:\s*16rem;[\s\S]*}/
  );
  assert.match(
    globalsSource,
    /@media \(max-width:\s*640px\)\s*{[\s\S]*\.interactive-chart__bars\s*{[\s\S]*height:\s*14rem;[\s\S]*}/
  );
  assert.match(globalsSource, /@media \(min-width:\s*960px\)/);
  assert.match(
    globalsSource,
    /@media \(min-width:\s*960px\)\s*{[\s\S]*\.winner-type-chart\s*{[\s\S]*grid-template-columns:\s*minmax\(0,\s*18rem\)\s*minmax\(0,\s*1fr\);[\s\S]*}/
  );
});
