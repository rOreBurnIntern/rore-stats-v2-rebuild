"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const package_json_1 = __importDefault(require("./package.json"));
(0, node_test_1.default)('uses the default Next.js production build command', () => {
    strict_1.default.equal(package_json_1.default.scripts.build, 'next build');
});
(0, node_test_1.default)('pins a Next.js 14 stack with Tailwind CSS and DaisyUI', () => {
    strict_1.default.equal(package_json_1.default.dependencies.next, '14.2.3');
    strict_1.default.equal(package_json_1.default.dependencies.react, '18.2.0');
    strict_1.default.equal(package_json_1.default.dependencies['react-dom'], '18.2.0');
    strict_1.default.equal(package_json_1.default.dependencies.daisyui, '4.12.24');
    strict_1.default.equal(package_json_1.default.devDependencies.tailwindcss, '3.4.1');
    strict_1.default.equal(package_json_1.default.devDependencies.postcss, '8.4.38');
    strict_1.default.equal(package_json_1.default.devDependencies.autoprefixer, '10.4.19');
});
