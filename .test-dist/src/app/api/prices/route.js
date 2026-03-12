"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const cors_1 = require("../../lib/cors");
const admin_1 = require("../../lib/supabase/admin");
async function GET() {
    try {
        const { data, error } = await admin_1.supabaseAdmin
            .from('prices')
            .select('weth_price, rore_price, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (error || !data) {
            return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'No price data available' }, { status: 404 }));
        }
        return (0, cors_1.withCors)(server_1.NextResponse.json({
            weth: Number(data.weth_price),
            ore: Number(data.rore_price),
            lastUpdate: new Date(data.created_at).getTime(),
        }));
    }
    catch (e) {
        return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 }));
    }
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
