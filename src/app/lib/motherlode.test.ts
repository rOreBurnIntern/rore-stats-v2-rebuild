import assert from 'node:assert/strict';
import test from 'node:test';

import { parseMotherlodeData } from './motherlode';

test('parses motherlode totalValue from wei', () => {
  assert.deepEqual(
    parseMotherlodeData({
      totalValue: '1234500000000000000',
      totalORELocked: 43210,
      participants: 246,
    }),
    {
      totalValue: 1.2345,
      totalORELocked: 43210,
      participants: 246,
    }
  );
});

test('accepts an already-normalized motherlode totalValue', () => {
  assert.deepEqual(
    parseMotherlodeData({
      totalValue: 12.5,
      totalORELocked: 43210,
      participants: 246,
    }),
    {
      totalValue: 12.5,
      totalORELocked: 43210,
      participants: 246,
    }
  );
});
