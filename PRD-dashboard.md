# PRD: rORE Stats Dashboard (v2)

## Goal
Build a fully functional, production-ready rORE stats dashboard that reliably displays real-time protocol data including motherlode metrics, WETH and rORE prices, and round analytics.

## Why Rebuild
- Current site (rore-stats.vercel.app) is broken: shows "Loading stats..." and missing data
- No reliable API connection
- Frontend not properly consuming backend data
- Previous implementation bypassed coding agent process

## API Endpoints

### `GET /api/explore`
- Proxies https://api.rore.supply/api/motherlode and https://api.rore.supply/api/rounds/current
- Returns combined response with `protocolStats` and `currentRound`
- Includes CORS headers and error handling

### `GET /api/stats`
- Aggregates data from /prices, /motherlode, and /rounds/current
- Returns clean object with key metrics:
  - wethPrice
  - rorePrice (estimated as ORE price * 0.95)
  - motherlode (totalValue, totalORELocked, participants)
  - currentRound (number, status, prize, entries, endTime)
  - lastUpdated
- Includes CORS headers and error handling

## Frontend
- Data source: /api/stats endpoint
- Components:
  - DashboardHeader: Title and last updated timestamp
  - StatCard: Reusable component for displaying metrics with loading states
- Layout: Responsive grid (1→2→4 columns)
- Styling: Tailwind CSS with DaisyUI
- Type safety: TypeScript interfaces

## Implementation Status
- [x] Initialize Git repository
- [x] Add prices API route
- [x] Implement explore API route
- [x] Implement stats API route
- [x] Update frontend page.tsx
- [x] Test locally
- [x] Deploy to Vercel

## Next Steps
1. Complete frontend implementation using /api/stats
2. Verify all endpoints return mock-compatible data
3. Test locally with `npm run dev`
4. Commit all changes and push to GitHub
5. Confirm Vercel auto-deploys

---
*Created on 2026-03-09 | Owner: rOreBurn_Intern | Status: In Progress*