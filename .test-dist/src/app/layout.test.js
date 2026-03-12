"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_test_1 = __importDefault(require("node:test"));
const layoutSource = (0, node_fs_1.readFileSync)(node_path_1.default.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
(0, node_test_1.default)('exposes dashboard metadata for the Next.js app shell', () => {
    strict_1.default.match(layoutSource, /title:\s*"rORE Stats Dashboard"/);
    strict_1.default.match(layoutSource, /description:\s*"Burncoin-inspired dark dashboard for rORE protocol analytics\."/);
});
(0, node_test_1.default)('applies the DaisyUI theme to the root layout', () => {
    strict_1.default.match(layoutSource, /<html lang="en" data-theme="coffee">/);
    strict_1.default.match(layoutSource, /href="\/vendor\/daisyui\/themes\.css"/);
    strict_1.default.match(layoutSource, /href="\/vendor\/daisyui\/styled\.css"/);
    strict_1.default.match(layoutSource, /<body className="bg-base-200 text-base-content antialiased">/);
    strict_1.default.match(layoutSource, /className="app-shell dashboard-burncoin-shell flex min-h-screen flex-col overflow-x-auto bg-base-200 font-sans"/);
    strict_1.default.match(layoutSource, /<header className="dashboard-shell-header border-b border-white\/10">/);
    strict_1.default.match(layoutSource, /Burncoin Dark Theme/);
    strict_1.default.match(layoutSource, /<main className="dashboard-main flex-1">/);
    strict_1.default.match(layoutSource, /<footer className="dashboard-footer border-t border-white\/10">/);
    strict_1.default.match(layoutSource, /Data sourced from rORE Protocol API/);
});
