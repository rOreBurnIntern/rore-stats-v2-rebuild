# PROJECT STATE: rORE Stats Dashboard v2 Rebuild
**Date:** 2026-03-10 09:25 UTC
**Status:** IN PROGRESS - BLOCKED

---

## WHAT'S WORKING
- All backend API routes implemented and committed to Git
- Frontend fully built with dark mode, responsive design
- `/api/prices` endpoint functional (live WETH/ORE prices)
- Live deployed at https://rore-stats-v2-rebuild.vercel.app (but broken)

---

## WHAT'S BROKEN
1. **Vercel Cache Issue** - `/api/stats` returns 500 error even after 10+ version bumps
   - Vercel serving old cached code that tries to call non-existent upstream APIs
   - Code on disk uses fallback values, but deploy isn't picking it up
   - Tried: 15+ deployments, version bumps, file touches - none worked

2. **Motherlode Data Gap** - NOT implemented
   - We tried to find HTTP API for motherlode that doesn't exist
   - Correct approach identified: use `rore-game-sdk.getMotherlodePool()` on Ronin blockchain
   - Need to implement:
     a. Database layer (SQLite/PostgreSQL) to persist values per round
     b. Cron job to fetch motherlode every round
     c. Update `/api/stats` to serve from database
   - Currently using hardcoded fallback values (205.8 ORE, round 30710)

3. **Email Not Sending** - Himalaya configured but SMTP not working
   - Gmail account in `~/.config/himalaya/config.toml`
   - Credentials exist but `cannot send message` error
   - PRD saved locally: `/home/openclaw/.openclaw/workspace/rore-stats-v2-rebuild/PRD-complete.md`

---

## DEPLOYMENT STATUS
- **NEW project:** `rore-stats-v2-rebuild` (GitHub: rOreBurnIntern/rore-stats-v2-rebuild)
- **OLD production:** `rore-stats.vercel.app` (still broken, never updated)
- **Current deploy:** `rore-stats-v2-rebuild.vercel.app` (also broken due to cache)
- **NOT DONE:** Did not merge into original repo or deploy to production

---

## NEXT STEPS (ORDERED BY PRIORITY)
1. **Test locally** - `npm run dev` in `rore-stats-v2-rebuild` to verify it works
2. **Fix Vercel** - Force cache clear or try Vercel CLI: `vercel deploy --prod --force`
3. **Implement blockchain reader** - Use SDK + database for actual motherlode data
4. **Deploy to production** - Replace or merge with original site
5. **Send PRD** - Email or document delivery to user

---

## FILES TO PRESERVE
- `/home/openclaw/.openclaw/workspace/rore-stats-v2-rebuild/PRD-complete.md`
- `/home/openclaw/.openclaw/workspace/rore-stats-v2-rebuild/PROJECT_STATE.md`
- `/home/openclaw/.openclaw/workspace/rore-stats-v2-rebuild/PRD-email.txt`
- All code commits already in Git (no local loss risk)

---

## KEY DECISIONS NEEDED
- Keep as separate project or merge into original?
- Use SQLite, PostgreSQL, or MongoDB for database layer?
- How to handle Vercel cache problem (force deploy, different hosting, etc.)?
