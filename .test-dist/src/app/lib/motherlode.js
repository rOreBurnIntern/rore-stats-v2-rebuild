"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMotherlodeHistory = parseMotherlodeHistory;
exports.parseMotherlodeData = parseMotherlodeData;
const WEI_DECIMALS = 18;
const MOTHERLODE_INCREMENT_PER_ROUND = 0.2;
const ROUNDS_SINCE_HIT_KEYS = ['roundsSinceHit', 'roundsSinceLastHit', 'rounds_since_hit'];
const CURRENT_ROUND_KEYS = ['currentRound', 'currentRoundNumber', 'current_round', 'round', 'roundNumber'];
const LAST_HIT_ROUND_KEYS = [
    'lastHitRound',
    'lastMotherlodeHitRound',
    'lastMotherlodeRound',
    'lastWonRound',
    'lastWinningRound',
    'last_hit_round',
    'motherlodeHitRound',
];
const HIT_FLAG_KEYS = ['hit', 'motherlodeHit', 'motherlodeWon', 'motherlode_hit'];
const HISTORY_KEYS = ['history', 'motherlodeHistory', 'totalValueHistory', 'timeline'];
const HISTORY_VALUE_KEYS = ['totalValue', 'value', 'amount'];
const HISTORY_LABEL_KEYS = ['label', 'name'];
const HISTORY_TIMESTAMP_KEYS = ['timestamp', 'time', 'date', 'updatedAt', 'createdAt'];
const HISTORY_ROUND_KEYS = ['round', 'roundNumber'];
const ROUND_ESTIMATE_EPSILON = 0.0000001;
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function readNumber(source, key) {
    const value = source[key];
    if (typeof value === 'number') {
        if (Number.isFinite(value)) {
            return value;
        }
        throw new Error(`Invalid numeric field: ${key}`);
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
function readOptionalNumberFromKeys(source, keys) {
    for (const key of keys) {
        const value = readOptionalNumber(source, key);
        if (value !== null) {
            return value;
        }
    }
    return null;
}
function readOptionalBoolean(source, key) {
    if (!(key in source)) {
        return null;
    }
    const value = source[key];
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue === 'true') {
            return true;
        }
        if (normalizedValue === 'false') {
            return false;
        }
    }
    throw new Error(`Invalid boolean field: ${key}`);
}
function readOptionalBooleanFromKeys(source, keys) {
    for (const key of keys) {
        const value = readOptionalBoolean(source, key);
        if (value !== null) {
            return value;
        }
    }
    return null;
}
function convertWeiToDecimal(value) {
    const normalizedValue = value.replace(/^0+/, '') || '0';
    const wholeDigits = normalizedValue.length > WEI_DECIMALS
        ? normalizedValue.slice(0, -WEI_DECIMALS)
        : '0';
    const fractionalDigits = normalizedValue
        .slice(-WEI_DECIMALS)
        .padStart(WEI_DECIMALS, '0')
        .replace(/0+$/, '');
    const decimalValue = fractionalDigits ? `${wholeDigits}.${fractionalDigits}` : wholeDigits;
    const parsedValue = Number(decimalValue);
    if (Number.isFinite(parsedValue)) {
        return parsedValue;
    }
    throw new Error('Invalid wei value: totalValue');
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
function readMotherlodeAmountFromKeys(source, keys) {
    for (const key of keys) {
        let value;
        try {
            value = readMotherlodeAmount(source, key);
        }
        catch (_a) {
            return null;
        }
        if (value !== null) {
            return value;
        }
    }
    return null;
}
function calculateMotherlodeValue(roundsSinceHit) {
    if (!Number.isInteger(roundsSinceHit) || roundsSinceHit < 0) {
        throw new Error('Invalid motherlode round count');
    }
    return Number((roundsSinceHit * MOTHERLODE_INCREMENT_PER_ROUND).toFixed(4));
}
function estimateRoundsSinceHit(totalValue) {
    if (!Number.isFinite(totalValue) || totalValue < 0) {
        return null;
    }
    const estimatedRounds = totalValue / MOTHERLODE_INCREMENT_PER_ROUND;
    const roundedRounds = Math.round(estimatedRounds);
    if (Math.abs(estimatedRounds - roundedRounds) > ROUND_ESTIMATE_EPSILON) {
        return null;
    }
    return roundedRounds;
}
function readOptionalString(source, key) {
    if (!(key in source)) {
        return null;
    }
    const value = source[key];
    if (typeof value === 'string' && value.trim() !== '') {
        return value.trim();
    }
    return null;
}
function readOptionalStringFromKeys(source, keys) {
    for (const key of keys) {
        const value = readOptionalString(source, key);
        if (value !== null) {
            return value;
        }
    }
    return null;
}
function parseTimestamp(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const normalizedValue = value.trim();
    const numericTimestamp = Number(normalizedValue);
    if (Number.isFinite(numericTimestamp)) {
        return numericTimestamp;
    }
    const parsedDate = Date.parse(normalizedValue);
    return Number.isNaN(parsedDate) ? null : parsedDate;
}
function readOptionalTimestampFromKeys(source, keys) {
    for (const key of keys) {
        if (!(key in source)) {
            continue;
        }
        const timestamp = parseTimestamp(source[key]);
        if (timestamp !== null) {
            return timestamp;
        }
    }
    return null;
}
function readLenientOptionalNumberFromKeys(source, keys) {
    try {
        return readOptionalNumberFromKeys(source, keys);
    }
    catch (_a) {
        return null;
    }
}
function formatHistoryLabel(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    }).format(timestamp);
}
function readHistoryPoints(payload) {
    for (const key of HISTORY_KEYS) {
        const historyValue = payload[key];
        if (!Array.isArray(historyValue)) {
            continue;
        }
        const parsedHistory = historyValue
            .map((entry, index) => {
            var _a, _b;
            if (!isRecord(entry)) {
                return null;
            }
            const value = readMotherlodeAmountFromKeys(entry, HISTORY_VALUE_KEYS);
            if (value === null) {
                return null;
            }
            const round = readLenientOptionalNumberFromKeys(entry, HISTORY_ROUND_KEYS);
            const timestamp = readOptionalTimestampFromKeys(entry, HISTORY_TIMESTAMP_KEYS);
            const label = (_a = readOptionalStringFromKeys(entry, HISTORY_LABEL_KEYS)) !== null && _a !== void 0 ? _a : (round !== null ? `R${round}` : timestamp !== null ? formatHistoryLabel(timestamp) : `P${index + 1}`);
            const sortValue = (_b = round !== null && round !== void 0 ? round : timestamp) !== null && _b !== void 0 ? _b : index;
            const historyPoint = { label, value };
            if (timestamp !== null) {
                historyPoint.timestamp = timestamp;
            }
            return { historyPoint, sortValue };
        })
            .filter((entry) => entry !== null)
            .sort((left, right) => left.sortValue - right.sortValue)
            .map(({ historyPoint }) => historyPoint);
        if (parsedHistory.length > 0) {
            return parsedHistory;
        }
    }
    return [];
}
function resolveRoundsSinceHit(motherlodePayload, currentRoundPayload) {
    var _a, _b;
    const roundsSinceHit = readOptionalNumberFromKeys(motherlodePayload, ROUNDS_SINCE_HIT_KEYS);
    if (roundsSinceHit !== null) {
        return roundsSinceHit;
    }
    const motherlodeWasHit = (_a = readOptionalBooleanFromKeys(motherlodePayload, HIT_FLAG_KEYS)) !== null && _a !== void 0 ? _a : (currentRoundPayload ? readOptionalBooleanFromKeys(currentRoundPayload, HIT_FLAG_KEYS) : null);
    if (motherlodeWasHit === true) {
        return 0;
    }
    const currentRound = readOptionalNumberFromKeys(currentRoundPayload !== null && currentRoundPayload !== void 0 ? currentRoundPayload : motherlodePayload, CURRENT_ROUND_KEYS);
    const lastHitRound = (_b = readOptionalNumberFromKeys(motherlodePayload, LAST_HIT_ROUND_KEYS)) !== null && _b !== void 0 ? _b : (currentRoundPayload ? readOptionalNumberFromKeys(currentRoundPayload, LAST_HIT_ROUND_KEYS) : null);
    if (currentRound === null || lastHitRound === null) {
        return null;
    }
    return currentRound - lastHitRound;
}
function parseMotherlodeHistory(payload, currentRoundPayload, fallbackTotalValue) {
    var _a;
    if (!isRecord(payload)) {
        return [];
    }
    const history = readHistoryPoints(payload);
    if (history.length > 0) {
        return history;
    }
    const parsedCurrentRoundPayload = isRecord(currentRoundPayload) ? currentRoundPayload : undefined;
    const totalValue = fallbackTotalValue !== null && fallbackTotalValue !== void 0 ? fallbackTotalValue : readMotherlodeAmount(payload, 'totalValue');
    const roundsSinceHit = (_a = resolveRoundsSinceHit(payload, parsedCurrentRoundPayload)) !== null && _a !== void 0 ? _a : (totalValue !== null ? estimateRoundsSinceHit(totalValue) : null);
    const currentRound = readOptionalNumberFromKeys(parsedCurrentRoundPayload !== null && parsedCurrentRoundPayload !== void 0 ? parsedCurrentRoundPayload : payload, CURRENT_ROUND_KEYS);
    if (roundsSinceHit === null
        || currentRound === null) {
        return [];
    }
    const startingRound = currentRound - roundsSinceHit;
    const firstVisibleRound = Math.max(startingRound, currentRound - 7);
    const points = [];
    for (let round = firstVisibleRound; round <= currentRound; round += 1) {
        const value = calculateMotherlodeValue(round - startingRound);
        points.push({
            label: `R${round}`,
            value,
        });
    }
    return points;
}
function parseMotherlodeData(payload, currentRoundPayload) {
    if (!isRecord(payload)) {
        throw new Error('Invalid motherlode payload');
    }
    const parsedCurrentRoundPayload = isRecord(currentRoundPayload) ? currentRoundPayload : undefined;
    const directTotalValue = readMotherlodeAmount(payload, 'totalValue');
    const computedRoundsSinceHit = resolveRoundsSinceHit(payload, parsedCurrentRoundPayload);
    const totalValue = directTotalValue !== null && directTotalValue !== void 0 ? directTotalValue : (computedRoundsSinceHit !== null ? calculateMotherlodeValue(computedRoundsSinceHit) : null);
    if (totalValue === null) {
        throw new Error('Invalid motherlode totalValue');
    }
    return {
        totalValue,
        totalORELocked: readNumber(payload, 'totalORELocked'),
        participants: readNumber(payload, 'participants'),
    };
}
