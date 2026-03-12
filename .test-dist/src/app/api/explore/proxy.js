"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPLORE_REQUEST_INIT = exports.EXPLORE_ERROR_RESPONSE = exports.EXPLORE_API_URL = void 0;
exports.buildExploreApiUrl = buildExploreApiUrl;
exports.getExploreProxyResponse = getExploreProxyResponse;
const log_1 = require("../../lib/log");
exports.EXPLORE_API_URL = 'https://api.rore.supply/api/explore';
exports.EXPLORE_ERROR_RESPONSE = { error: 'Failed to fetch explore data' };
exports.EXPLORE_REQUEST_INIT = {
    cache: 'no-store',
    headers: {
        Accept: 'application/json',
    },
};
function appendSearchParams(target, source) {
    if (!source) {
        return;
    }
    if (source instanceof URLSearchParams) {
        for (const [key, value] of source.entries()) {
            target.append(key, value);
        }
        return;
    }
    for (const [key, value] of Object.entries(source)) {
        if (value === undefined) {
            continue;
        }
        if (typeof value === 'string') {
            target.append(key, value);
            continue;
        }
        if (Array.isArray(value)) {
            for (const entry of value) {
                target.append(key, entry);
            }
        }
    }
}
function buildExploreApiUrl(searchParams) {
    const upstreamUrl = new URL(exports.EXPLORE_API_URL);
    appendSearchParams(upstreamUrl.searchParams, searchParams);
    return upstreamUrl;
}
async function getExploreProxyResponse(searchParams) {
    const upstreamUrl = buildExploreApiUrl(searchParams);
    try {
        const res = await fetch(upstreamUrl, exports.EXPLORE_REQUEST_INIT);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return { body: data, status: 200 };
    }
    catch (error) {
        (0, log_1.logError)('Failed to fetch explore data', error, {
            route: '/api/explore',
            upstreamUrl: upstreamUrl.toString(),
        });
        return { body: exports.EXPLORE_ERROR_RESPONSE, status: 500 };
    }
}
