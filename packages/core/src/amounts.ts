import { CanopyError, CanopyErrorCode } from "./errors";

const U64_MAX = (1n << 64n) - 1n;
const U128_MAX = (1n << 128n) - 1n;

export type MoveUintBits = 64 | 128;
export type MoveUintInput = bigint | number | string;

export interface ParseUnitsOptions {
  decimals: number;
  bits?: MoveUintBits;
  label?: string;
}

export interface FormatUnitsOptions {
  decimals: number;
  trimTrailingZeros?: boolean;
}

export function parseU64(value: MoveUintInput, label = "amount"): bigint {
  return parseMoveUint(value, 64, label);
}

export function parseU128(value: MoveUintInput, label = "amount"): bigint {
  return parseMoveUint(value, 128, label);
}

export function parseMoveUint(
  value: MoveUintInput,
  bits: MoveUintBits,
  label = "amount"
): bigint {
  const parsed = parseInteger(value, label);
  const max = bits === 64 ? U64_MAX : U128_MAX;

  if (parsed < 0n || parsed > max) {
    throw new CanopyError(
      `${label} must fit in u${bits}`,
      CanopyErrorCode.InvalidAmount,
      { value: value.toString(), bits }
    );
  }

  return parsed;
}

export function parseOptionalU64(
  value: MoveUintInput | null | undefined,
  label = "amount"
): bigint | undefined {
  return parseOptionalMoveUint(value, 64, label);
}

export function parseOptionalU128(
  value: MoveUintInput | null | undefined,
  label = "amount"
): bigint | undefined {
  return parseOptionalMoveUint(value, 128, label);
}

export function parseOptionalMoveUint(
  value: MoveUintInput | null | undefined,
  bits: MoveUintBits,
  label = "amount"
): bigint | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (
      trimmed.length === 0 ||
      trimmed.toLowerCase() === "none" ||
      trimmed.toLowerCase() === "null"
    ) {
      return undefined;
    }

    return parseMoveUint(trimmed, bits, label);
  }

  return parseMoveUint(value, bits, label);
}

export function formatMoveUint(value: MoveUintInput, bits: MoveUintBits): string {
  return parseMoveUint(value, bits).toString();
}

export function parseUnits(
  value: string,
  { decimals, bits = 64, label = "amount" }: ParseUnitsOptions
): bigint {
  validateDecimals(decimals);

  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new CanopyError(
      `${label} must be a non-negative decimal string`,
      CanopyErrorCode.InvalidAmount,
      { value }
    );
  }

  const [wholePart, fractionalPart = ""] = value.split(".");
  if (fractionalPart.length > decimals) {
    throw new CanopyError(
      `${label} has too many decimal places`,
      CanopyErrorCode.InvalidAmount,
      { value, decimals }
    );
  }

  const paddedFractionalPart = fractionalPart.padEnd(decimals, "0");
  const rawValue = `${wholePart}${paddedFractionalPart}`.replace(/^0+(?=\d)/, "");
  return parseMoveUint(rawValue || "0", bits, label);
}

export function formatUnits(
  value: MoveUintInput,
  { decimals, trimTrailingZeros = true }: FormatUnitsOptions
): string {
  validateDecimals(decimals);

  const parsed = parseMoveUint(value, 128);
  if (decimals === 0) {
    return parsed.toString();
  }

  const rawValue = parsed.toString().padStart(decimals + 1, "0");
  const wholePart = rawValue.slice(0, -decimals);
  let fractionalPart = rawValue.slice(-decimals);

  if (trimTrailingZeros) {
    fractionalPart = fractionalPart.replace(/0+$/, "");
  }

  return fractionalPart.length > 0
    ? `${wholePart}.${fractionalPart}`
    : wholePart;
}

function parseInteger(value: MoveUintInput, label: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new CanopyError(
        `${label} must be a safe integer`,
        CanopyErrorCode.InvalidAmount,
        { value }
      );
    }

    return BigInt(value);
  }

  if (!/^\d+$/.test(value)) {
    throw new CanopyError(
      `${label} must be an unsigned integer string`,
      CanopyErrorCode.InvalidAmount,
      { value }
    );
  }

  return BigInt(value);
}

function validateDecimals(decimals: number): void {
  if (!Number.isSafeInteger(decimals) || decimals < 0) {
    throw new CanopyError(
      "decimals must be a non-negative safe integer",
      CanopyErrorCode.InvalidAmount,
      { decimals }
    );
  }
}
