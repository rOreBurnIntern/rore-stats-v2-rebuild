"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const route_1 = require("./route");
const originalFetch = global.fetch;
const originalConsoleError = console.error;
function mockFetch(implementation) {
    global.fetch = implementation;
}
node_test_1.default.afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
});
(0, node_test_1.default)('returns the upstream motherlode payload', async () => {
    const payload = {
        totalValue: '1234500000000000000',
        totalORELocked: 43210,
        participants: 246,
    };
    const requestedUrls = [];
    const requestedInits = [];
    mockFetch(async (input, init) => {
        requestedUrls.push(input.toString());
        requestedInits.push(init);
        return new Response(JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    });
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(await response.json(), {
        totalValue: 1.2345,
        totalORELocked: 43210,
        participants: 246,
    });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
    strict_1.default.deepEqual(requestedUrls, ['https://api.rore.supply/api/motherlode']);
    strict_1.default.deepEqual(requestedInits[0], {
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
        },
    });
});
(0, node_test_1.default)('calculates the motherlode totalValue from round progress when the upstream payload omits it', async () => {
    const requestedUrls = [];
    mockFetch(async (input) => {
        requestedUrls.push(input.toString());
        if (requestedUrls.length === 1) {
            return new Response(JSON.stringify({
                lastHitRound: 12,
                totalORELocked: 43210,
                participants: 246,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 200,
            });
        }
        return new Response(JSON.stringify({
            round: 15,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    });
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(await response.json(), {
        totalValue: 0.6,
        totalORELocked: 43210,
        participants: 246,
    });
    strict_1.default.deepEqual(requestedUrls, [
        'https://api.rore.supply/api/motherlode',
        'https://api.rore.supply/api/rounds/current',
    ]);
});
(0, node_test_1.default)('returns a 500 response when the upstream motherlode API fails', async () => {
    console.error = () => { };
    mockFetch(async () => new Response(null, { status: 503 }));
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to fetch motherlode data' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('returns a 500 response when the motherlode fetch throws', async () => {
    console.error = () => { };
    mockFetch(async () => {
        throw new Error('network down');
    });
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to fetch motherlode data' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('returns CORS headers for preflight requests', () => {
    const response = (0, route_1.OPTIONS)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});
