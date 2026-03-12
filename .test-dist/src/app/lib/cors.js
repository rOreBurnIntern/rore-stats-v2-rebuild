"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_HEADERS = void 0;
exports.setCorsHeaders = setCorsHeaders;
exports.withCors = withCors;
exports.CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-cron-secret',
};
function setCorsHeaders(target) {
    for (const [name, value] of Object.entries(exports.CORS_HEADERS)) {
        if ('set' in target) {
            target.set(name, value);
            continue;
        }
        target.setHeader(name, value);
    }
}
function withCors(response) {
    setCorsHeaders(response.headers);
    return response;
}
