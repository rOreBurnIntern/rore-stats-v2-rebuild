"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const explore_1 = __importDefault(require("./explore"));
const originalFetch = global.fetch;
const originalConsoleError = console.error;
function mockFetch(implementation) {
    global.fetch = implementation;
}
function createResponseRecorder() {
    return {
        body: undefined,
        headers: {},
        statusCode: 200,
        json(body) {
            this.body = body;
            return body;
        },
        setHeader(name, value) {
            this.headers[name] = value;
        },
        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
    };
}
node_test_1.default.afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
});
(0, node_test_1.default)('returns the upstream explore payload through the Vercel API handler', async () => {
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
    const response = createResponseRecorder();
    await (0, explore_1.default)({ method: 'GET', query: { page: '2', limit: '25', sort: 'desc' } }, response);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.deepEqual(response.body, payload);
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
    strict_1.default.equal(response.headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type');
    strict_1.default.equal(response.headers['Content-Type'], 'application/json');
    strict_1.default.equal(requestedUrl, 'https://api.rore.supply/api/explore?page=2&limit=25&sort=desc');
    strict_1.default.deepEqual(requestedInit, {
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
        },
    });
});
(0, node_test_1.default)('preserves repeated query params for paginated explore requests', async () => {
    let requestedUrl = '';
    mockFetch(async (input) => {
        requestedUrl = input.toString();
        return new Response(JSON.stringify({ items: [] }), { status: 200 });
    });
    const response = createResponseRecorder();
    await (0, explore_1.default)({ method: 'GET', query: { page: '3', filter: ['active', 'ended'] } }, response);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.equal(requestedUrl, 'https://api.rore.supply/api/explore?page=3&filter=active&filter=ended');
});
(0, node_test_1.default)('returns 405 for unsupported methods without calling the upstream API', async () => {
    let fetchCalled = false;
    mockFetch(async () => {
        fetchCalled = true;
        return new Response();
    });
    const response = createResponseRecorder();
    await (0, explore_1.default)({ method: 'POST' }, response);
    strict_1.default.equal(fetchCalled, false);
    strict_1.default.equal(response.statusCode, 405);
    strict_1.default.deepEqual(response.body, { error: 'Method not allowed' });
    strict_1.default.equal(response.headers.Allow, 'GET');
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
});
(0, node_test_1.default)('returns a 500 response when the upstream API fails', async () => {
    console.error = () => { };
    mockFetch(async () => new Response(null, { status: 503 }));
    const response = createResponseRecorder();
    await (0, explore_1.default)({ method: 'GET', query: { page: '1' } }, response);
    strict_1.default.equal(response.statusCode, 500);
    strict_1.default.deepEqual(response.body, { error: 'Failed to fetch explore data' });
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
    strict_1.default.equal(response.headers['Content-Type'], 'application/json');
});
(0, node_test_1.default)('returns CORS headers for preflight requests', async () => {
    let fetchCalled = false;
    mockFetch(async () => {
        fetchCalled = true;
        return new Response();
    });
    const response = createResponseRecorder();
    await (0, explore_1.default)({ method: 'OPTIONS' }, response);
    strict_1.default.equal(fetchCalled, false);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.deepEqual(response.body, {});
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
    strict_1.default.equal(response.headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type');
});
