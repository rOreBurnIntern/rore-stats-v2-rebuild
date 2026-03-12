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
const originalDateNow = Date.now;
function mockFetch(implementation) {
    global.fetch = implementation;
}
function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        headers: {
            'Content-Type': 'application/json',
        },
        status,
    });
}
node_test_1.default.afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    Date.now = originalDateNow;
});
(0, node_test_1.default)('returns aggregated stats with CORS headers', async () => {
    Date.now = () => 1741525600000;
    let requestCount = 0;
    mockFetch(async (input) => {
        requestCount += 1;
        if (requestCount === 1) {
            strict_1.default.equal(input.toString(), 'https://api.rore.supply/api/prices');
            return jsonResponse({ weth: 1234.56, rore: 0.8 });
        }
        strict_1.default.equal(input.toString(), 'https://api.rore.supply/api/explore');
        return jsonResponse({
            protocolStats: {
                motherlode: '1234500000000000000',
                totalValue: 456.7,
                participants: 42,
            },
            roundsData: [
                {
                    roundId: 7,
                    status: 'active',
                    prize: 999,
                    entries: 77,
                    endTime: 1741526200000,
                },
            ],
        });
    });
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(await response.json(), {
        wethPrice: 1234.56,
        rorePrice: 0.8,
        motherlode: {
            totalValue: 456.7,
            totalORELocked: 1.2345,
            participants: 42,
        },
        currentRound: {
            number: 7,
            status: 'active',
            prize: 999,
            entries: 77,
            endTime: 1741526200000,
        },
        lastUpdated: 1741525600000,
    });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});
(0, node_test_1.default)('falls back to aliases from the upstream prices payload', async () => {
    Date.now = () => 1741525600000;
    let requestCount = 0;
    mockFetch(async () => {
        requestCount += 1;
        if (requestCount === 1) {
            return jsonResponse({ usd: 1234.56, ore: 0.8 });
        }
        return jsonResponse({
            protocolStats: {
                motherlode: 12,
                totalValue: 456.7,
                participants: 42,
            },
            roundsData: [
                {
                    roundId: 7,
                    status: 'active',
                    prize: 999,
                    entries: 77,
                    endTime: 1741526200000,
                },
            ],
        });
    });
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(await response.json(), {
        wethPrice: 1234.56,
        rorePrice: 0.8,
        motherlode: {
            totalValue: 456.7,
            totalORELocked: 12,
            participants: 42,
        },
        currentRound: {
            number: 7,
            status: 'active',
            prize: 999,
            entries: 77,
            endTime: 1741526200000,
        },
        lastUpdated: 1741525600000,
    });
});
(0, node_test_1.default)('returns valid JSON when explore fields are missing', async () => {
    Date.now = () => 1741525600000;
    let requestCount = 0;
    mockFetch(async () => {
        requestCount += 1;
        if (requestCount === 1) {
            return jsonResponse({ weth: 1234.56, rore: 0.8 });
        }
        return jsonResponse({
            protocolStats: {
                blockPerformance: {
                    1: 3,
                    5: '2',
                    25: 1,
                },
                winnerTypes: [
                    {
                        type: 'Winner Take All',
                        count: 9,
                    },
                    {
                        type: 'Split',
                        count: 3,
                    },
                ],
            },
            roundsData: [
                {
                    roundId: 17,
                },
            ],
        });
    });
    const response = await (0, route_1.GET)();
    const body = await response.json();
    strict_1.default.equal(response.status, 200);
    strict_1.default.deepEqual(body, {
        wethPrice: 1234.56,
        rorePrice: 0.8,
        blockPerformance: Array.from({ length: 25 }, (_, index) => ({
            block: index + 1,
            wins: index === 0 ? 3 : index === 4 ? 2 : index === 24 ? 1 : 0,
        })),
        winnerTypes: {
            winnerTakeAll: 9,
            split: 3,
        },
        motherlode: {
            totalValue: 0,
            totalORELocked: 0,
            participants: 0,
        },
        currentRound: {
            number: 17,
            status: 'Unknown',
            prize: 0,
            entries: 0,
            endTime: 1741525600000,
        },
        lastUpdated: 1741525600000,
    });
});
(0, node_test_1.default)('returns a 500 response when aggregation fails', async () => {
    let loggedMessage = '';
    let loggedPayload;
    console.error = (message, payload) => {
        loggedMessage = String(message);
        loggedPayload = payload;
    };
    mockFetch(async () => new Response(null, { status: 503 }));
    const response = await (0, route_1.GET)();
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to aggregate stats from rORE API' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(loggedMessage, 'Failed to fetch stats');
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.route, '/api/stats');
    strict_1.default.equal((loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.error).message, 'Prices failed: 503');
});
(0, node_test_1.default)('returns CORS headers for preflight requests', () => {
    const response = (0, route_1.OPTIONS)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});
