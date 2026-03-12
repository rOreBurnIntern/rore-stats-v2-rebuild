"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const route_1 = require("./route");
const originalFetch = global.fetch;
const originalConsoleError = console.error;
const originalGithubToken = process.env.GITHUB_TOKEN;
node_test_1.default.afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    if (originalGithubToken === undefined) {
        delete process.env.GITHUB_TOKEN;
        return;
    }
    process.env.GITHUB_TOKEN = originalGithubToken;
});
(0, node_test_1.default)('creates a private user repository by default', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    let requestedUrl = '';
    let requestedInit;
    global.fetch = async (input, init) => {
        requestedUrl = input.toString();
        requestedInit = init;
        return new Response(JSON.stringify({
            full_name: 'openclaw/example-repo',
            html_url: 'https://github.com/openclaw/example-repo',
            private: true,
        }), { status: 201 });
    };
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({
            description: ' Test repository ',
            name: '  example-repo  ',
        }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 201);
    strict_1.default.deepEqual(await response.json(), {
        full_name: 'openclaw/example-repo',
        html_url: 'https://github.com/openclaw/example-repo',
        private: true,
    });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
    strict_1.default.equal(requestedUrl, 'https://api.github.com/user/repos');
    strict_1.default.deepEqual(requestedInit, {
        body: JSON.stringify({
            auto_init: true,
            description: 'Test repository',
            name: 'example-repo',
            private: true,
        }),
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        method: 'POST',
    });
});
(0, node_test_1.default)('creates an organization repository when organization is provided', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    let requestedUrl = '';
    global.fetch = async (input) => {
        requestedUrl = input.toString();
        return new Response(JSON.stringify({ full_name: 'rOreBurnIntern/example-repo' }), { status: 201 });
    };
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({
            autoInit: false,
            name: 'example-repo',
            organization: ' rOreBurnIntern ',
            private: false,
        }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 201);
    strict_1.default.equal(requestedUrl, 'https://api.github.com/orgs/rOreBurnIntern/repos');
    strict_1.default.deepEqual(await response.json(), { full_name: 'rOreBurnIntern/example-repo' });
});
(0, node_test_1.default)('rejects requests without a repository name', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({ name: '   ' }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 400);
    strict_1.default.deepEqual(await response.json(), { error: 'Repository name is required' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('returns a 500 response when the GitHub token is missing', async () => {
    delete process.env.GITHUB_TOKEN;
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({ name: 'example-repo' }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'GitHub token is not configured' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('forwards GitHub API validation errors', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    global.fetch = async () => new Response(JSON.stringify({ message: 'Repository creation failed' }), { status: 422 });
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({ name: 'example-repo' }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 422);
    strict_1.default.deepEqual(await response.json(), { error: 'Repository creation failed' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});
(0, node_test_1.default)('returns a 500 response when the GitHub request throws', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    let loggedMessage = '';
    let loggedPayload;
    console.error = (message, payload) => {
        loggedMessage = String(message);
        loggedPayload = payload;
    };
    global.fetch = async () => {
        throw new Error('network down');
    };
    const response = await (0, route_1.POST)(new Request('http://localhost/api/github/repositories', {
        body: JSON.stringify({ name: 'example-repo' }),
        method: 'POST',
    }));
    strict_1.default.equal(response.status, 500);
    strict_1.default.deepEqual(await response.json(), { error: 'Failed to create GitHub repository' });
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(loggedMessage, 'Failed to create GitHub repository');
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.organization, null);
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.route, '/api/github/repositories');
    strict_1.default.equal(loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.upstreamUrl, 'https://api.github.com/user/repos');
    strict_1.default.equal((loggedPayload === null || loggedPayload === void 0 ? void 0 : loggedPayload.error).message, 'network down');
});
(0, node_test_1.default)('returns CORS headers for preflight requests', () => {
    const response = (0, route_1.OPTIONS)();
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, POST, PUT, DELETE, OPTIONS');
    strict_1.default.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
});
