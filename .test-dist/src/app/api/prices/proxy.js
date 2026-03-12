"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICES_REQUEST_INIT = exports.PRICES_ERROR_RESPONSE = exports.PRICES_API_URL = void 0;
exports.getPricesProxyResponse = getPricesProxyResponse;
const log_1 = require("../../lib/log");
exports.PRICES_API_URL = 'https://api.rore.supply/api/prices';
exports.PRICES_ERROR_RESPONSE = { error: 'Failed to fetch prices' };
exports.PRICES_REQUEST_INIT = {
    cache: 'no-store',
    headers: {
        Accept: 'application/json',
    },
};
async function getPricesProxyResponse() {
    try {
        const res = await fetch(exports.PRICES_API_URL, exports.PRICES_REQUEST_INIT);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return { body: data, status: 200 };
    }
    catch (error) {
        (0, log_1.logError)('Failed to fetch prices', error, {
            route: '/api/prices',
            upstreamUrl: exports.PRICES_API_URL,
        });
        return { body: exports.PRICES_ERROR_RESPONSE, status: 500 };
    }
}
