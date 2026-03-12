"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const motherlode_1 = __importDefault(require("./motherlode"));
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
(0, node_test_1.default)('returns the normalized motherlode payload through the Vercel API handler', async () => {
    const requestedUrls = [];
    const requestedInits = [];
    mockFetch(async (input, init) => {
        requestedUrls.push(input.toString());
        requestedInits.push(init);
        return new Response(JSON.stringify({
            totalValue: '1234500000000000000',
            totalORELocked: 43210,
            participants: 246,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    });
    const response = createResponseRecorder();
    await (0, motherlode_1.default)({ method: 'GET' }, response);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.deepEqual(response.body, {
        totalValue: 1.2345,
        totalORELocked: 43210,
        participants: 246,
    });
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
    strict_1.default.equal(response.headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type');
    strict_1.default.equal(response.headers['Content-Type'], 'application/json');
    strict_1.default.deepEqual(requestedUrls, ['https://api.rore.supply/api/motherlode']);
    strict_1.default.deepEqual(requestedInits[0], {
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
        },
    });
});
(0, node_test_1.default)('falls back to the current round API when the motherlode totalValue is missing', async () => {
    const requestedUrls = [];
    mockFetch(async (input) => {
        requestedUrls.push(input.toString());
        if (requestedUrls.length === 1) {
            return new Response(JSON.stringify({
                lastHitRound: 12,
                totalORELocked: 43210,
                participants: 246,
            }), { status: 200 });
        }
        return new Response(JSON.stringify({
            round: 15,
        }), { status: 200 });
    });
    const response = createResponseRecorder();
    await (0, motherlode_1.default)({ method: 'GET' }, response);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.deepEqual(response.body, {
        totalValue: 0.6,
        totalORELocked: 43210,
        participants: 246,
    });
    strict_1.default.deepEqual(requestedUrls, [
        'https://api.rore.supply/api/motherlode',
        'https://api.rore.supply/api/rounds/current',
    ]);
});
(0, node_test_1.default)('returns 405 for unsupported methods without calling the upstream API', async () => {
    let fetchCalled = false;
    mockFetch(async () => {
        fetchCalled = true;
        return new Response();
    });
    const response = createResponseRecorder();
    await (0, motherlode_1.default)({ method: 'POST' }, response);
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
    await (0, motherlode_1.default)({ method: 'GET' }, response);
    strict_1.default.equal(response.statusCode, 500);
    strict_1.default.deepEqual(response.body, { error: 'Failed to fetch motherlode data' });
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
    await (0, motherlode_1.default)({ method: 'OPTIONS' }, response);
    strict_1.default.equal(fetchCalled, false);
    strict_1.default.equal(response.statusCode, 200);
    strict_1.default.deepEqual(response.body, {});
    strict_1.default.equal(response.headers['Access-Control-Allow-Origin'], '*');
    strict_1.default.equal(response.headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers['Access-Control-Allow-Headers'], 'Content-Type');
});
