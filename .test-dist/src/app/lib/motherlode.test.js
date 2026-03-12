"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const motherlode_1 = require("./motherlode");
(0, node_test_1.default)('parses motherlode totalValue from wei', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeData)({
        totalValue: '1234500000000000000',
        totalORELocked: 43210,
        participants: 246,
    }), {
        totalValue: 1.2345,
        totalORELocked: 43210,
        participants: 246,
    });
});
(0, node_test_1.default)('accepts an already-normalized motherlode totalValue', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeData)({
        totalValue: 12.5,
        totalORELocked: 43210,
        participants: 246,
    }), {
        totalValue: 12.5,
        totalORELocked: 43210,
        participants: 246,
    });
});
(0, node_test_1.default)('calculates motherlode totalValue from rounds since hit', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeData)({
        roundsSinceHit: 3,
        totalORELocked: 43210,
        participants: 246,
    }), {
        totalValue: 0.6,
        totalORELocked: 43210,
        participants: 246,
    });
});
(0, node_test_1.default)('calculates motherlode totalValue from the current round and last hit round', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeData)({
        lastHitRound: 12,
        totalORELocked: 43210,
        participants: 246,
    }, {
        round: 15,
    }), {
        totalValue: 0.6,
        totalORELocked: 43210,
        participants: 246,
    });
});
(0, node_test_1.default)('resets the motherlode totalValue to zero after a hit', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeData)({
        totalORELocked: 43210,
        participants: 246,
    }, {
        round: 15,
        motherlodeHit: true,
    }), {
        totalValue: 0,
        totalORELocked: 43210,
        participants: 246,
    });
});
(0, node_test_1.default)('parses motherlode history points from the upstream payload', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeHistory)({
        history: [
            {
                label: 'R13',
                totalValue: '400000000000000000',
            },
            {
                label: 'R14',
                totalValue: '600000000000000000',
            },
            {
                label: 'R15',
                totalValue: '800000000000000000',
            },
        ],
    }), [
        { label: 'R13', value: 0.4 },
        { label: 'R14', value: 0.6 },
        { label: 'R15', value: 0.8 },
    ]);
});
(0, node_test_1.default)('preserves timestamps for upstream motherlode history points', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeHistory)({
        history: [
            {
                totalValue: '600000000000000000',
                timestamp: Date.parse('2026-03-08T00:00:00.000Z'),
            },
            {
                totalValue: '800000000000000000',
                timestamp: Date.parse('2026-03-09T00:00:00.000Z'),
            },
        ],
    }), [
        { label: 'Mar 8', value: 0.6, timestamp: Date.parse('2026-03-08T00:00:00.000Z') },
        { label: 'Mar 9', value: 0.8, timestamp: Date.parse('2026-03-09T00:00:00.000Z') },
    ]);
});
(0, node_test_1.default)('derives motherlode history from round progress when explicit history is unavailable', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeHistory)({
        lastHitRound: 12,
    }, {
        round: 15,
    }, 0.6), [
        { label: 'R12', value: 0 },
        { label: 'R13', value: 0.2 },
        { label: 'R14', value: 0.4 },
        { label: 'R15', value: 0.6 },
    ]);
});
(0, node_test_1.default)('derives motherlode history from totalValue when round-progress fields are unavailable', () => {
    strict_1.default.deepEqual((0, motherlode_1.parseMotherlodeHistory)({
        totalValue: 0.6,
    }, {
        round: 15,
    }, 0.6), [
        { label: 'R12', value: 0 },
        { label: 'R13', value: 0.2 },
        { label: 'R14', value: 0.4 },
        { label: 'R15', value: 0.6 },
    ]);
});
