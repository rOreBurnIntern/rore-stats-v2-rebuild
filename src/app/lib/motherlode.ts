export interface MotherlodeApiResponse {
  totalValue: number;
  totalORELocked: number;
  participants: number;
}

const WEI_DECIMALS = 18;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readNumber(source: Record<string, unknown>, key: string): number {
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

function convertWeiToDecimal(value: string): number {
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

function readMotherlodeAmount(source: Record<string, unknown>, key: string): number {
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

export function parseMotherlodeData(payload: unknown): MotherlodeApiResponse {
  if (!isRecord(payload)) {
    throw new Error('Invalid motherlode payload');
  }

  return {
    totalValue: readMotherlodeAmount(payload, 'totalValue'),
    totalORELocked: readNumber(payload, 'totalORELocked'),
    participants: readNumber(payload, 'participants'),
  };
}
