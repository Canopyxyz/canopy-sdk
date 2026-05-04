import { CanopyError, CanopyErrorCode } from "./errors";

export type HexString = `0x${string}`;
export type MoveAddress = HexString;

export function normalizeMoveAddress(address: string): HexString {
  const input = address.startsWith("0x") ? address.slice(2) : address;

  if (!/^[0-9a-fA-F]{1,64}$/.test(input)) {
    throw new CanopyError("Invalid Move address", CanopyErrorCode.InvalidAddress, {
      address,
    });
  }

  return `0x${input.toLowerCase().padStart(64, "0")}` as HexString;
}

export function sameMoveAddress(left: string, right: string): boolean {
  return normalizeMoveAddress(left) === normalizeMoveAddress(right);
}

export function isMoveAddress(address: unknown): address is HexString {
  if (typeof address !== "string") {
    return false;
  }

  try {
    normalizeMoveAddress(address);
    return true;
  } catch {
    return false;
  }
}

export function assertMoveAddress(
  address: unknown,
  label = "address"
): asserts address is HexString {
  if (!isMoveAddress(address)) {
    throw new CanopyError(`Invalid ${label}`, CanopyErrorCode.InvalidAddress, {
      address,
    });
  }
}
