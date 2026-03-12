# P1-1: Fix layout order to PRD spec (TDD)

## Objective
Modify `src/app/page.tsx` to match PRD v3.1 layout:

1. Keep `DashboardHeader` at top.
2. Keep `ProtocolStatCards` immediately after header.
3. Replace the two `InteractiveBarChart` sections (Market Snapshot, Protocol Snapshot) with a single grid containing:
   - `WinnerTypePieChart`
   - `InteractiveBarChart` for Block Performance (title "Block Performance")
   These must be side-by-side on xl screens (`xl:grid-cols-2`).
4. After that grid, render `MotherlodeLineChart` full-width (no grid columns).
5. Remove `MotherlodeCard` and `RoundCard` completely.
6. Remove unused imports (Market/Protocol chart data points no longer used).

## Non-goals
- Do not change any component internals.
- Do not modify `lib/db-stats.ts`.
- Keep data fetching logic intact.

## TDD Instructions
Write failing tests in `src/app/page.test.tsx` that verify:
- "Market Snapshot" and "Protocol Snapshot" strings do NOT appear.
- "MotherlodeCard" and "RoundCard" are NOT rendered.
- The main chart container has class `xl:grid-cols-2` and contains exactly 2 direct children (pie + bar).
- `MotherlodeLineChart` container appears after the grid and has class `motherlode-trend`.
- `ProtocolStatCards` appears before the charts grid.

Then implement changes to make tests pass.

## Acceptance
- `npm run build` succeeds.
- `npm test` passes.
- Code diff shows only the layout restructure; no extra refactors.

## Deliverables
- Show the test additions/edits.
- Show the final `src/app/page.tsx` diff against main.
- Confirm build and test pass.
- Do NOT push. Await explicit approval.
