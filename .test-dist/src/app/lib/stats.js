"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatsData = getStatsData;
const log_1 = require("./log");
const PRICES_API_URL = 'https://api.rore.supply/api/prices';
const EXPLORE_API_URL = 'https://api.rore.supply/api/explore';
const WINNER_TAKE_ALL_KEYS = [
    'winnerTakeAll',
    'winner_take_all',
    'winnerTakeAllCount',
    'winner_take_all_count',
    'winnerTakeAllRounds',
    'winner_take_all_rounds',
    'winnerTakeAllWins',
    'winner_take_all_wins',
    'takeAll',
    'take_all',
    'wta',
];
const SPLIT_KEYS = ['split', 'splitCount', 'split_count', 'splitRounds', 'split_rounds', 'splitWins', 'split_wins'];
const WINNER_TYPE_CONTAINER_KEYS = [
    'winnerTypes',
    'winnerTypeCounts',
    'winnerTypeSummary',
    'winnerTypeBreakdown',
    'winner_types',
];
const WINNER_TYPE_LABEL_KEYS = ['type', 'name', 'label', 'key'];
const WINNER_TYPE_VALUE_KEYS = ['count', 'value', 'total', 'rounds', 'wins'];
const BLOCK_PERFORMANCE_KEYS = [
    'blockPerformance',
    'winsPerBlock',
    'blockWins',
    'blockWinCounts',
    'blockBreakdown',
];
const BLOCK_LABEL_KEYS = ['block', 'blockNumber', 'winningBlock', 'winnerBlock', 'label', 'name', 'key'];
const ROUND_COLLECTION_KEYS = ['items', 'rounds', 'results', 'data'];
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function readNumber(source, key) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
        const parsedValue = Number(value);
        if (Number.isFinite(parsedValue)) {
            return parsedValue;
        }
    }
    throw new Error(`Invalid numeric field: ${key}`);
}
function readOptionalNumber(source, key) {
    if (!(key in source)) {
        return null;
    }
    return readNumber(source, key);
}
function readNumberFromKeys(source, keys) {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsedValue = Number(value);
            if (Number.isFinite(parsedValue)) {
                return parsedValue;
            }
        }
    }
    throw new Error(`Invalid numeric fields: ${keys.join(', ')}`);
}
function readOptionalNumberFromKeys(source, keys) {
    for (const key of keys) {
        const value = readOptionalNumber(source, key);
        if (value !== null) {
            return value;
        }
    }
    return null;
}
function convertWeiToDecimal(value) {
    const normalizedValue = value.replace(/^0+/, '') || '0';
    const wholeDigits = normalizedValue.length > 18 ? normalizedValue.slice(0, -18) : '0';
    const fractionalDigits = normalizedValue
        .slice(-18)
        .padStart(18, '0')
        .replace(/0+$/, '');
    const decimalValue = fractionalDigits ? `${wholeDigits}.${fractionalDigits}` : wholeDigits;
    const parsedValue = Number(decimalValue);
    if (Number.isFinite(parsedValue)) {
        return parsedValue;
    }
    throw new Error('Invalid wei value: motherlode');
}
function readMotherlodeAmount(source, key) {
    if (!(key in source)) {
        return null;
    }
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Invalid numeric field: ${key}`);
    }
    const normalizedValue = value.trim();
    if (/^\d+$/.test(normalizedValue)) {
        return convertWeiToDecimal(normalizedValue);
    }
    const parsedValue = Number(normalizedValue);
    if (Number.isFinite(parsedValue)) {
        return parsedValue;
    }
    throw new Error(`Invalid numeric field: ${key}`);
}
function readOptionalStringFromKeys(source, keys) {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'string' && value.trim() !== '') {
            return value.trim();
        }
    }
    return null;
}
function parseBlockNumber(value) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 25) {
        return value;
    }
    if (typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const directValue = Number(value);
    if (Number.isInteger(directValue) && directValue >= 1 && directValue <= 25) {
        return directValue;
    }
    const matchedValue = value.match(/\d+/);
    if (!matchedValue) {
        return null;
    }
    const parsedValue = Number(matchedValue[0]);
    return Number.isInteger(parsedValue) && parsedValue >= 1 && parsedValue <= 25 ? parsedValue : null;
}
function readOptionalBlockFromKeys(source, keys) {
    for (const key of keys) {
        const parsedBlock = parseBlockNumber(source[key]);
        if (parsedBlock !== null) {
            return parsedBlock;
        }
    }
    return null;
}
function readOptionalNumericValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
        const parsedValue = Number(value);
        if (Number.isFinite(parsedValue)) {
            return parsedValue;
        }
    }
    return null;
}
function addWinsByBlock(winsByBlock, block, wins) {
    var _a;
    winsByBlock.set(block, ((_a = winsByBlock.get(block)) !== null && _a !== void 0 ? _a : 0) + Math.max(wins, 0));
}
function buildBlockPerformance(winsByBlock) {
    const totalWins = Array.from(winsByBlock.values()).reduce((sum, wins) => sum + wins, 0);
    if (totalWins <= 0) {
        return undefined;
    }
    return Array.from({ length: 25 }, (_, index) => {
        var _a;
        return ({
            block: index + 1,
            wins: (_a = winsByBlock.get(index + 1)) !== null && _a !== void 0 ? _a : 0,
        });
    });
}
function parseBlockPerformanceRecord(source) {
    var _a;
    const winsByBlock = new Map();
    for (const [key, value] of Object.entries(source)) {
        const block = parseBlockNumber(key);
        const wins = (_a = readOptionalNumericValue(value)) !== null && _a !== void 0 ? _a : (isRecord(value) ? readOptionalNumberFromKeys(value, WINNER_TYPE_VALUE_KEYS) : null);
        if (block !== null && wins !== null) {
            addWinsByBlock(winsByBlock, block, wins);
        }
    }
    return buildBlockPerformance(winsByBlock);
}
function parseBlockPerformanceArray(source) {
    var _a, _b, _c, _d, _e;
    const winsByBlock = new Map();
    for (const entry of source) {
        if (!isRecord(entry)) {
            continue;
        }
        const block = (_b = (_a = readOptionalBlockFromKeys(entry, BLOCK_LABEL_KEYS)) !== null && _a !== void 0 ? _a : (isRecord(entry.winner) ? readOptionalBlockFromKeys(entry.winner, BLOCK_LABEL_KEYS) : null)) !== null && _b !== void 0 ? _b : (isRecord(entry.result) ? readOptionalBlockFromKeys(entry.result, BLOCK_LABEL_KEYS) : null);
        if (block === null) {
            continue;
        }
        const wins = (_e = (_d = (_c = readOptionalNumberFromKeys(entry, WINNER_TYPE_VALUE_KEYS)) !== null && _c !== void 0 ? _c : (isRecord(entry.winner) ? readOptionalNumberFromKeys(entry.winner, WINNER_TYPE_VALUE_KEYS) : null)) !== null && _d !== void 0 ? _d : (isRecord(entry.result) ? readOptionalNumberFromKeys(entry.result, WINNER_TYPE_VALUE_KEYS) : null)) !== null && _e !== void 0 ? _e : 1;
        addWinsByBlock(winsByBlock, block, wins);
    }
    return buildBlockPerformance(winsByBlock);
}
function parseBlockPerformance(payload) {
    if (Array.isArray(payload)) {
        return parseBlockPerformanceArray(payload);
    }
    if (!isRecord(payload)) {
        return undefined;
    }
    for (const key of BLOCK_PERFORMANCE_KEYS) {
        const parsedBlockPerformance = parseBlockPerformance(payload[key]);
        if (parsedBlockPerformance) {
            return parsedBlockPerformance;
        }
    }
    for (const key of ROUND_COLLECTION_KEYS) {
        const parsedBlockPerformance = parseBlockPerformance(payload[key]);
        if (parsedBlockPerformance) {
            return parsedBlockPerformance;
        }
    }
    return parseBlockPerformanceRecord(payload);
}
function buildWinnerTypes(winnerTakeAll, split) {
    if (winnerTakeAll === null && split === null) {
        return undefined;
    }
    const normalizedWinnerTakeAll = Math.max(winnerTakeAll !== null && winnerTakeAll !== void 0 ? winnerTakeAll : 0, 0);
    const normalizedSplit = Math.max(split !== null && split !== void 0 ? split : 0, 0);
    if (normalizedWinnerTakeAll === 0 && normalizedSplit === 0) {
        return undefined;
    }
    return {
        winnerTakeAll: normalizedWinnerTakeAll,
        split: normalizedSplit,
    };
}
function normalizeWinnerType(value) {
    const normalizedValue = value.toLowerCase().replace(/[^a-z]/g, '');
    if (normalizedValue.includes('winnertakeall') || normalizedValue.includes('takeall') || normalizedValue === 'wta') {
        return 'winnerTakeAll';
    }
    if (normalizedValue.includes('split')) {
        return 'split';
    }
    return null;
}
function parseWinnerTypes(payload) {
    if (!isRecord(payload)) {
        return undefined;
    }
    const directWinnerTypes = buildWinnerTypes(readOptionalNumberFromKeys(payload, WINNER_TAKE_ALL_KEYS), readOptionalNumberFromKeys(payload, SPLIT_KEYS));
    if (directWinnerTypes) {
        return directWinnerTypes;
    }
    for (const key of WINNER_TYPE_CONTAINER_KEYS) {
        const container = payload[key];
        if (Array.isArray(container)) {
            let winnerTakeAll = null;
            let split = null;
            for (const entry of container) {
                if (!isRecord(entry)) {
                    continue;
                }
                const winnerType = readOptionalStringFromKeys(entry, WINNER_TYPE_LABEL_KEYS);
                const count = readOptionalNumberFromKeys(entry, WINNER_TYPE_VALUE_KEYS);
                if (!winnerType || count === null) {
                    continue;
                }
                const normalizedWinnerType = normalizeWinnerType(winnerType);
                if (normalizedWinnerType === 'winnerTakeAll') {
                    winnerTakeAll = count;
                }
                if (normalizedWinnerType === 'split') {
                    split = count;
                }
            }
            const parsedWinnerTypes = buildWinnerTypes(winnerTakeAll, split);
            if (parsedWinnerTypes) {
                return parsedWinnerTypes;
            }
            continue;
        }
        if (isRecord(container)) {
            const parsedWinnerTypes = parseWinnerTypes(container);
            if (parsedWinnerTypes) {
                return parsedWinnerTypes;
            }
        }
    }
    return undefined;
}
function parsePricesData(payload) {
    if (!isRecord(payload)) {
        throw new Error('Invalid prices payload');
    }
    return {
        weth: readNumberFromKeys(payload, ['weth', 'usd']),
        rore: readNumberFromKeys(payload, ['rore', 'ore']),
    };
}
function parseExploreData(payload) {
    var _a, _b, _c, _d;
    if (!isRecord(payload)) {
        throw new Error('Invalid explore payload');
    }
    const payloadRecord = payload;
    const protocolStats = isRecord(payloadRecord.protocolStats) ? payloadRecord.protocolStats : null;
    // Parse protocolStats.motherlode (from wei to ORE)
    const motherlodeOracle = (_b = (_a = readMotherlodeAmount(payloadRecord, 'motherlode')) !== null && _a !== void 0 ? _a : (protocolStats ? readMotherlodeAmount(protocolStats, 'motherlode') : null)) !== null && _b !== void 0 ? _b : 0;
    // Get current round from roundsData[0]
    const roundsArray = Array.isArray(payloadRecord.roundsData)
        ? payloadRecord.roundsData
        : Array.isArray(payloadRecord.rounds)
            ? payloadRecord.rounds
            : [];
    const roundsList = roundsArray.map((round) => {
        var _a, _b, _c, _d;
        return ({
            roundId: isRecord(round) ? ((_a = readOptionalNumber(round, 'roundId')) !== null && _a !== void 0 ? _a : 0) : 0,
            status: isRecord(round) && typeof round.status === 'string' && round.status.trim() !== ''
                ? round.status
                : 'Unknown',
            prize: isRecord(round) ? ((_b = readOptionalNumber(round, 'prize')) !== null && _b !== void 0 ? _b : 0) : 0,
            entries: isRecord(round) ? ((_c = readOptionalNumber(round, 'entries')) !== null && _c !== void 0 ? _c : 0) : 0,
            endTime: isRecord(round) ? ((_d = readOptionalNumber(round, 'endTime')) !== null && _d !== void 0 ? _d : Date.now()) : Date.now()
        });
    });
    // Parse block performance from protocolStats or roundsData
    const blockPerformance = parseBlockPerformance(payloadRecord.protocolStats || payloadRecord);
    // Parse winner types
    const winnerTypes = parseWinnerTypes(payloadRecord.protocolStats || payloadRecord);
    return {
        motherlode: motherlodeOracle,
        totalValue: protocolStats ? ((_c = readOptionalNumber(protocolStats, 'totalValue')) !== null && _c !== void 0 ? _c : 0) : 0,
        participants: protocolStats ? ((_d = readOptionalNumber(protocolStats, 'participants')) !== null && _d !== void 0 ? _d : 0) : 0,
        rounds: roundsList,
        blockPerformance,
        winnerTypes
    };
}
async function getStatsData() {
    try {
        // Fetch prices
        const pricesData = await fetch(PRICES_API_URL, { signal: AbortSignal.timeout(5000) });
        if (!pricesData.ok)
            throw new Error(`Prices failed: ${pricesData.status}`);
        const pricesPayload = await pricesData.json();
        const parsedPrices = parsePricesData(pricesPayload);
        // Fetch explore data (contains motherlode and rounds)
        const exploreData = await fetch(EXPLORE_API_URL, { signal: AbortSignal.timeout(5000) });
        if (!exploreData.ok)
            throw new Error(`Explore failed: ${exploreData.status}`);
        const explorePayload = await exploreData.json();
        const exploreParsed = parseExploreData(explorePayload);
        // Get current round
        const currentRound = exploreParsed.rounds[0] || {
            roundId: 30710,
            status: 'Unknown',
            prize: 0,
            entries: 0,
            endTime: Date.now()
        };
        return {
            wethPrice: parsedPrices.weth,
            rorePrice: parsedPrices.rore,
            blockPerformance: exploreParsed.blockPerformance,
            winnerTypes: exploreParsed.winnerTypes,
            motherlode: {
                totalValue: exploreParsed.totalValue,
                totalORELocked: exploreParsed.motherlode,
                participants: exploreParsed.participants,
            },
            currentRound: {
                number: currentRound.roundId,
                status: currentRound.status,
                prize: currentRound.prize,
                entries: currentRound.entries,
                endTime: currentRound.endTime,
            },
            lastUpdated: Date.now(),
        };
    }
    catch (error) {
        (0, log_1.logError)('Failed to fetch stats', error, { route: '/api/stats' });
        return null;
    }
}
