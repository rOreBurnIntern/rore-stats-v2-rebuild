# PRD: P1-4 — Header Component Cleanup

## Objective
Clean up header components to remove legacy Burncoin branding and ensure consistency with the new rORE theme.

## Scope
- Inspect and modify all header-related components:
  - `src/app/components/DashboardHeader.tsx` (primary header)
  - Any other components used in the header (e.g., navigation, logo, theme toggles)
- Remove explicit "Burncoin" branding, especially the "Burncoin Dark Theme" chip or badge.
- Replace with rORE branding: "rORE Stats", "rORE Dashboard", or appropriate.
- Ensure header styling aligns with the new orange/amber theme from P1-2.
- Check for any leftover references to "Burncoin" in the header (text, alt attributes, ARIA labels).
- Verify header responsiveness and accessibility remain intact.

## Success Criteria
- Header displays only rORE-appropriate branding.
- No "Burncoin" text visible in the UI or in component code.
- Header continues to function: navigation, theme toggle (if present), and layout.
- All tests pass (including any header-specific tests).
- Build succeeds.

## Constraints
- Do not change overall layout structure beyond necessary textual updates.
- Preserve existing interactive behavior.

## Notes
- The header may include a theme indicator chip that currently says "Burncoin Dark Theme". Replace with something like "rORE Dark Theme" or remove the chip if not needed.
- Review `DashboardHeader.tsx` and any imported subcomponents.
- Ensure any logo images or icons are appropriate; if a Burncoin-specific logo is used, replace with rORE logo (if available). If no replacement, use a generic placeholder and note to design team.
