import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/vercel-deploy.yml", "utf8");

test("runs verification before any Vercel deployment", () => {
  assert.match(workflow, /jobs:\n  verify:/);
  assert.match(workflow, /- name: Run tests\n        run: npm test/);
  assert.match(workflow, /- name: Run lint\n        run: npm run lint/);
  assert.match(workflow, /- name: Build application\n        run: npm run build/);
  assert.match(workflow, /deploy-preview:\n    if: github\.event_name == 'pull_request'\n    needs: verify/);
  assert.match(workflow, /deploy-production:\n    if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'\n    needs: verify/);
});

test("uses Vercel secrets for preview and production deployments", () => {
  assert.match(workflow, /VERCEL_ORG_ID: \$\{\{ secrets\.VERCEL_ORG_ID \}\}/);
  assert.match(workflow, /VERCEL_PROJECT_ID: \$\{\{ secrets\.VERCEL_PROJECT_ID \}\}/);
  assert.match(workflow, /npx vercel pull --yes --environment=preview --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
  assert.match(workflow, /npx vercel deploy --prebuilt --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
  assert.match(workflow, /npx vercel pull --yes --environment=production --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
  assert.match(workflow, /npx vercel deploy --prebuilt --prod --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
});
