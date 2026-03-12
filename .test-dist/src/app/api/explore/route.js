"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const cors_1 = require("../../lib/cors");
const proxy_1 = require("./proxy");
async function GET(request) {
    const { body, status } = await (0, proxy_1.getExploreProxyResponse)(new URL(request.url).searchParams);
    return (0, cors_1.withCors)(server_1.NextResponse.json(body, { status }));
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
