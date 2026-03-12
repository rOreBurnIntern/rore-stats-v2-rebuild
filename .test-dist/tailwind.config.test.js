"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_test_1 = __importDefault(require("node:test"));
const tailwindConfigSource = (0, node_fs_1.readFileSync)(node_path_1.default.join(process.cwd(), 'tailwind.config.ts'), 'utf8');
(0, node_test_1.default)('scans the app directory for Tailwind classes', () => {
    strict_1.default.match(tailwindConfigSource, /"\.\/src\/pages\/\*\*\/\*\.\{js,ts,jsx,tsx,mdx\}"/);
    strict_1.default.match(tailwindConfigSource, /"\.\/src\/components\/\*\*\/\*\.\{js,ts,jsx,tsx,mdx\}"/);
    strict_1.default.match(tailwindConfigSource, /"\.\/src\/app\/\*\*\/\*\.\{js,ts,jsx,tsx,mdx\}"/);
});
(0, node_test_1.default)('registers DaisyUI with the custom rore theme', () => {
    strict_1.default.match(tailwindConfigSource, /plugins:\s*\[\]/);
    strict_1.default.doesNotMatch(tailwindConfigSource, /daisyui:/);
});
