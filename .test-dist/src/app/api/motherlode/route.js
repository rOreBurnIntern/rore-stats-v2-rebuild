"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const cors_1 = require("../../lib/cors");
const admin_1 = require("../../lib/supabase/admin");
async function GET() {
    try {
        // Try protocol_stats first
        const { data: proto, error: protoErr } = await admin_1.supabaseAdmin
            .from('protocol_stats')
            .select('total_value, total_ore_locked, participants')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (proto) {
            return (0, cors_1.withCors)(server_1.NextResponse.json({
                totalValue: Number(proto.total_value) || 0,
                totalORELocked: Number(proto.total_ore_locked) || 0,
                participants: Number(proto.participants) || 0,
            }));
        }
        // Fallback: compute from rounds
        const { data: rounds, error: roundsErr } = await admin_1.supabaseAdmin
            .from('rounds')
            .select('prize')
            .limit(1)
            .order('prize', { ascending: false });
        // Not a great fallback; return zeros
        return (0, cors_1.withCors)(server_1.NextResponse.json({
            totalValue: 0,
            totalORELocked: 0,
            participants: 0,
        }));
    }
    catch (e) {
        return (0, cors_1.withCors)(server_1.NextResponse.json({ error: 'Failed to fetch motherlode data' }, { status: 500 }));
    }
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
