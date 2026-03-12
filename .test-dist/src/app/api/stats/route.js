"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.OPTIONS = OPTIONS;
/* v2.0.0 */ const server_1 = require("next/server");
const cors_1 = require("../../lib/cors");
const db_stats_1 = require("../../lib/db-stats");
async function GET() {
    const stats = await (0, db_stats_1.getDbStatsData)();
    if (!stats) {
        return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'Failed to load stats from database' }, { status: 500 }));
    }
    return (0, cors_1.withCors)(server_1.NextResponse.json(stats));
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
