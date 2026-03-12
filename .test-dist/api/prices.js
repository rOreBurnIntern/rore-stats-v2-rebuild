"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const proxy_1 = require("../src/app/api/prices/proxy");
const cors_1 = require("../src/app/lib/cors");
const METHOD_NOT_ALLOWED_RESPONSE = { error: 'Method not allowed' };
async function handler(req, res) {
    (0, cors_1.setCorsHeaders)(res);
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json(METHOD_NOT_ALLOWED_RESPONSE);
    }
    const { body, status } = await (0, proxy_1.getPricesProxyResponse)();
    res.setHeader('Content-Type', 'application/json');
    return res.status(status).json(body);
}
