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
(0, node_test_1.default)('returns the upstream explore payload', async () => {
    const payload = { items: [{ id: '1' }], page: 2 };
    let requestedUrl = '';
    let requestedInit;
    mockFetch(async (input, init) => {
        requestedUrl = input.toString();
        requestedInit = init;
        return new Response(JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    });
    const request = new Request('http://localhost/api/explore?page=2&sort=desc');
    const response = await (0, route_1.GET)(request);
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(await response.json(), payload);
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
    strict_1.default.equal(requestedUrl, 'https://api.rore.supply/api/explore?page=2&sort=desc');
    strict_1.default.deepEqual(requestedInit, {
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
        },
    });
});
(0, node_test_1.default)('returns a 500 response when the upstream explore API fails', async () => {
    let loggedMessage = '';
    let loggedPayload;
    console.error = (message, payload) => {
        loggedMessage = String(message);
        loggedPayload = payload;
    };
    mockFetch(async () => new Response(null, { status: 503 }));
    const request = new Request('http://localhost/api/explore');
    const response = await (0, route_1.GET)(request);
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to fetch explore data' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(loggedMessage, 'Failed to fetch explore data');
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.route, '/api/explore');
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.upstreamUrl, 'https://api.rore.supply/api/explore');
    strict_1.default.equal((loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.error).message, 'HTTP error! status: 503');
});
(0, node_test_1.default)('returns a 500 response when the explore fetch throws', async () => {
    console.error = () => { };
    mockFetch(async () => {
        throw new Error('network down');
    });
    const request = new Request('http://localhost/api/explore');
    const response = await (0, route_1.GET)(request);
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to fetch explore data' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('returns CORS headers for preflight requests', () => {
    const response = (0, route_1.OPTIONS)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});
