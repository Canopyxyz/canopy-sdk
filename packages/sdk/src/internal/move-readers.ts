import {
  CanopyError,
  CanopyErrorCode,
  normalizeMoveAddress,
  parseU128,
  parseU64,
} from "@canopyhub/canopy-sdk-core";

interface MoveObjectLike {
  inner?: unknown;
}

export function readMoveAddress(value: unknown): string {
  if (typeof value === "string") {
    return normalizeMoveAddress(value);
  }

  if (value && typeof value === "object" && "inner" in value) {
    return readMoveAddress((value as MoveObjectLike).inner);
  }

  throw new CanopyError("Expected Move address", CanopyErrorCode.ViewCallFailed, {
    valueType: typeof value,
  });
}

export function readMoveAddressVector(values: unknown): string[] {
  if (!Array.isArray(values)) {
    throw new CanopyError(
      "Expected Move address vector",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof values }
    );
  }

  return values.map(readMoveAddress);
}

export function readMoveOption<T>(
  value: unknown,
  readValue: (value: unknown) => T
): T | null {
  if (!value || typeof value !== "object" || !("vec" in value)) {
    throw new CanopyError("Expected Move option", CanopyErrorCode.ViewCallFailed, {
      valueType: typeof value,
    });
  }

  const vec = (value as { vec?: unknown[] }).vec;
  if (!Array.isArray(vec)) {
    throw new CanopyError("Expected Move option vector", CanopyErrorCode.ViewCallFailed, {
      valueType: typeof vec,
    });
  }

  if (vec.length === 0) {
    return null;
  }

  if (vec.length !== 1) {
    throw new CanopyError("Expected Move option with at most one value", CanopyErrorCode.ViewCallFailed, {
      length: vec.length,
    });
  }

  return readValue(vec[0]);
}

export function readMoveU64(value: unknown): bigint {
  return parseU64(stringifyMoveScalar(value));
}

export function readMoveU128(value: unknown): bigint {
  return parseU128(stringifyMoveScalar(value));
}

/**
 * Reads a Move `u8`.
 *
 * Fullnodes serialize u8 / u16 / u32 as JSON **numbers** and only u64 and wider as
 * strings, so a number is the normal wire shape here — `decimals` being the common
 * case. Delegating to `readMoveU64` (which rejects numbers to prevent u64
 * precision loss) meant every u8 field threw `Expected Move scalar`, breaking
 * `canopy.getVault`, `canopy.listVaults` and the Meridian batch views on every
 * chain. The client fixtures hid it by supplying `decimals` as `"8"`.
 *
 * A u8 cannot lose precision in a JS number, so accepting one is safe.
 */
export function readMoveU8(value: unknown): number {
  const parsed = typeof value === "number" ? numberToMoveInteger(value) : readMoveU64(value);

  if (parsed > 255n) {
    throw new CanopyError("Expected Move u8", CanopyErrorCode.ViewCallFailed, {
      value: parsed.toString(),
    });
  }

  return Number(parsed);
}

function numberToMoveInteger(value: number): bigint {
  if (!Number.isInteger(value) || !Number.isSafeInteger(value) || value < 0) {
    throw new CanopyError(
      "Expected Move integer to be a non-negative safe integer",
      CanopyErrorCode.ViewCallFailed,
      { value }
    );
  }

  return BigInt(value);
}

/**
 * Stringifies a Move integer scalar for the wide types (u64 / u128 / u256).
 *
 * Deliberately rejects JavaScript numbers: those widths exceed
 * `Number.MAX_SAFE_INTEGER`, so a number arriving here means precision was
 * already lost upstream. Fullnodes send them as strings. Small widths are handled
 * by `readMoveU8`, which accepts numbers because they cannot lose precision.
 */
export function stringifyMoveScalar(value: unknown): string {
  if (typeof value === "string" || typeof value === "bigint") {
    return String(value);
  }

  throw new CanopyError("Expected Move scalar", CanopyErrorCode.ViewCallFailed, {
    valueType: typeof value,
  });
}

export function readMoveString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  throw new CanopyError("Expected Move string", CanopyErrorCode.ViewCallFailed, {
    valueType: typeof value,
  });
}

export function readMoveBool(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  throw new CanopyError("Expected Move bool", CanopyErrorCode.ViewCallFailed, {
    valueType: typeof value,
  });
}
