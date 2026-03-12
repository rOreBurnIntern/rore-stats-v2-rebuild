"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = logError;
function serializeError(error) {
    if (error instanceof Error) {
        return {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
    }
    if (typeof error === 'string' && error.length > 0) {
        return { message: error };
    }
    return {
        message: 'Unexpected error value thrown',
        value: error,
    };
}
function logError(message, error, context = {}) {
    console.error(message, Object.assign(Object.assign({}, context), { error: serializeError(error) }));
}
