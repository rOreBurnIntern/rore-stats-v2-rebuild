"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const node_fs_1 = require("node:fs");
const workflow = (0, node_fs_1.readFileSync)(".github/workflows/vercel-deploy.yml", "utf8");
(0, node_test_1.default)("runs verification before any Vercel deployment", () => {
    strict_1.default.match(workflow, /jobs:\n  verify:/);
    strict_1.default.match(workflow, /- name: Run tests\n        run: npm test/);
    strict_1.default.match(workflow, /- name: Run lint\n        run: npm run lint/);
    strict_1.default.match(workflow, /- name: Build application\n        run: npm run build/);
    strict_1.default.match(workflow, /deploy-preview:\n    if: github\.event_name == 'pull_request'\n    needs: verify/);
    strict_1.default.match(workflow, /deploy-production:\n    if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'\n    needs: verify/);
});
(0, node_test_1.default)("uses Vercel secrets for preview and production deployments", () => {
    strict_1.default.match(workflow, /VERCEL_ORG_ID: \$\{\{ secrets\.VERCEL_ORG_ID \}\}/);
    strict_1.default.match(workflow, /VERCEL_PROJECT_ID: \$\{\{ secrets\.VERCEL_PROJECT_ID \}\}/);
    strict_1.default.match(workflow, /npx vercel pull --yes --environment=preview --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
    strict_1.default.match(workflow, /npx vercel deploy --prebuilt --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
    strict_1.default.match(workflow, /npx vercel pull --yes --environment=production --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
    strict_1.default.match(workflow, /npx vercel deploy --prebuilt --prod --token=\$\{\{ secrets\.VERCEL_TOKEN \}\}/);
});
