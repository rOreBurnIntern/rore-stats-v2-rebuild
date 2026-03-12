"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const cors_1 = require("../../../lib/cors");
const log_1 = require("../../../lib/log");
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';
const MISSING_TOKEN_RESPONSE = { error: 'GitHub token is not configured' };
const INVALID_BODY_RESPONSE = { error: 'Repository name is required' };
const GENERIC_ERROR_RESPONSE = { error: 'Failed to create GitHub repository' };
function getEndpoint(organization) {
    if (organization) {
        return `${GITHUB_API_URL}/orgs/${organization}/repos`;
    }
    return `${GITHUB_API_URL}/user/repos`;
}
function getErrorMessage(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    const message = payload instanceof Error ? payload.message : Reflect.get(payload, 'message');
    return typeof message === 'string' && message.length > 0 ? message : null;
}
async function POST(request) {
    var _a, _b, _c, _d;
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return (0, cors_1.withCors)(server_1.NextResponse.json(MISSING_TOKEN_RESPONSE, { status: 500 }));
    }
    let body;
    try {
        body = await request.json();
    }
    catch (_e) {
        return (0, cors_1.withCors)(server_1.NextResponse.json(INVALID_BODY_RESPONSE, { status: 400 }));
    }
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return (0, cors_1.withCors)(server_1.NextResponse.json(INVALID_BODY_RESPONSE, { status: 400 }));
    }
    const name = body.name.trim();
    const organization = typeof body.organization === 'string' && body.organization.trim().length > 0
        ? body.organization.trim()
        : undefined;
    try {
        const response = await fetch(getEndpoint(organization), {
            body: JSON.stringify({
                auto_init: (_a = body.autoInit) !== null && _a !== void 0 ? _a : true,
                description: ((_b = body.description) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                name,
                private: (_c = body.private) !== null && _c !== void 0 ? _c : true,
            }),
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': GITHUB_API_VERSION,
            },
            method: 'POST',
        });
        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            return (0, cors_1.withCors)(server_1.NextResponse.json({ error: (_d = getErrorMessage(errorPayload)) !== null && _d !== void 0 ? _d : GENERIC_ERROR_RESPONSE.error }, { status: response.status }));
        }
        const payload = await response.json();
        return (0, cors_1.withCors)(server_1.NextResponse.json(payload, { status: 201 }));
    }
    catch (error) {
        (0, log_1.logError)('Failed to create GitHub repository', error, {
            organization: organization !== null && organization !== void 0 ? organization : null,
            route: '/api/github/repositories',
            upstreamUrl: getEndpoint(organization),
        });
        return (0, cors_1.withCors)(server_1.NextResponse.json(GENERIC_ERROR_RESPONSE, { status: 500 }));
    }
}
function OPTIONS() {
    return (0, cors_1.withCors)(server_1.NextResponse.json({}));
}
