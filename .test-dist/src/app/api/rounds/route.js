"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const cors_1 = require("../../lib/cors");
const admin_1 = require("../../lib/supabase/admin");
async function GET() {
    try {
        // Get the active round or latest
        let { data, error } = await admin_1.supabaseAdmin
            .from('rounds')
            .select('round_id, status, prize, entries, end_time')
            .eq('status', 'Active')
            .limit(1)
            .maybeSingle();
        if (error || !data) {
            // Fallback to latest by round_id
            ({ data, error } = await admin_1.supabaseAdmin
                .from('rounds')
                .select('round_id, status, prize, entries, end_time')
                .order('round_id', { ascending: false })
                .limit(1)
                .maybeSingle());
        }
        if (error || !data) {
            return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'No round data available' }, { status: 404 }));
        }
        return (0, cors_1.withCors)(server_1.NextResponse.json({
            roundId: data.round_id,
            status: data.status,
            prize: Number(data.prize),
            entries: Number(data.entries),
            endTime: new Date(data.end_time).getTime(),
        }));
    }
    catch (e) {
        return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'Failed to fetch round data' }, { status: 500 }));
    }
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
