"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_test_1 = __importDefault(require("node:test"));
const globalsSource = (0, node_fs_1.readFileSync)(node_path_1.default.join(process.cwd(), 'src/app/globals.css'), 'utf8');
(0, node_test_1.default)('defines the Burncoin dark theme tokens and shell overlays', () => {
    strict_1.default.match(globalsSource, /--background:\s*#090402;/);
    strict_1.default.match(globalsSource, /--accent:\s*#ff8a2a;/);
    strict_1.default.match(globalsSource, /color-scheme:\s*dark;/);
    strict_1.default.match(globalsSource, /\.dashboard-burncoin-shell::before/);
    strict_1.default.match(globalsSource, /\.dashboard-burncoin-shell::after/);
    strict_1.default.match(globalsSource, /\.dashboard-chip/);
    strict_1.default.match(globalsSource, /\.dashboard-ember/);
});
(0, node_test_1.default)('defines responsive breakpoints for mobile and desktop chart layouts', () => {
    strict_1.default.match(globalsSource, /@media \(max-width:\s*640px\)/);
    strict_1.default.match(globalsSource, /@media \(max-width:\s*640px\)\s*{[\s\S]*\.interactive-chart\s*{[\s\S]*min-height:\s*16rem;[\s\S]*}/);
    strict_1.default.match(globalsSource, /@media \(max-width:\s*640px\)\s*{[\s\S]*\.interactive-chart__bars\s*{[\s\S]*height:\s*14rem;[\s\S]*}/);
    strict_1.default.match(globalsSource, /@media \(min-width:\s*960px\)/);
    strict_1.default.match(globalsSource, /@media \(min-width:\s*960px\)\s*{[\s\S]*\.winner-type-chart\s*{[\s\S]*grid-template-columns:\s*minmax\(0,\s*18rem\)\s*minmax\(0,\s*1fr\);[\s\S]*}/);
});
