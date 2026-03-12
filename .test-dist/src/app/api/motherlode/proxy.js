"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOTHERLODE_REQUEST_INIT = exports.MOTHERLODE_ERROR_RESPONSE = exports.ROUND_API_URL = exports.MOTHERLODE_API_URL = void 0;
exports.getMotherlodeProxyResponse = getMotherlodeProxyResponse;
const motherlode_1 = require("../../lib/motherlode");
const log_1 = require("../../lib/log");
exports.MOTHERLODE_API_URL = 'https://api.rore.supply/api/motherlode';
exports.ROUND_API_URL = 'https://api.rore.supply/api/rounds/current';
exports.MOTHERLODE_ERROR_RESPONSE = { error: 'Failed to fetch motherlode data' };
exports.MOTHERLODE_REQUEST_INIT = {
    cache: 'no-store',
    headers: {
        Accept: 'application/json',
    },
};
async function fetchJson(url) {
    const res = await fetch(url, exports.MOTHERLODE_REQUEST_INIT);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
}
async function getMotherlodeProxyResponse() {
    try {
        const data = await fetchJson(exports.MOTHERLODE_API_URL);
        try {
            return { body: (0, motherlode_1.parseMotherlodeData)(data), status: 200 };
        }
        catch (error) {
            if (!(error instanceof Error) || error.message !== 'Invalid motherlode totalValue') {
                throw error;
            }
            const currentRoundData = await fetchJson(exports.ROUND_API_URL);
            return { body: (0, motherlode_1.parseMotherlodeData)(data, currentRoundData), status: 200 };
        }
    }
    catch (error) {
        (0, log_1.logError)('Failed to fetch motherlode data', error, {
            route: '/api/motherlode',
            upstreamUrl: exports.MOTHERLODE_API_URL,
        });
        return { body: exports.MOTHERLODE_ERROR_RESPONSE, status: 500 };
    }
}
