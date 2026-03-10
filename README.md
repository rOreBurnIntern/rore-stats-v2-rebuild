# rORE Stats Dashboard

This is a [Next.js 14](https://nextjs.org) project for the rORE Protocol, initialized with Tailwind CSS and DaisyUI, providing real-time insights into protocol metrics including:

- WETH and rORE token prices
- Motherlode total locked value and participants
- Current round analytics (prize, entries, time remaining)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- DaisyUI

## Data Flow

- Prices: `/api/prices` → fetches from `https://api.rore.supply/api/prices`
- Motherlode: `/api/motherlode` → fetches from `https://api.rore.supply/api/motherlode`
- Rounds: `/api/rounds` → fetches from `https://api.rore.supply/api/rounds/current`

## Deployment

Deployed via Vercel. The site automatically revalidates data every 30 seconds.

GitHub Actions now handles the deployment pipeline:

- Pull requests run `npm test`, `npm run lint`, and `npm run build`, then create a Vercel preview deployment.
- Pushes to `main` run the same verification steps, then publish a production deployment to Vercel.

Required repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
