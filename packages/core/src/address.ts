import { CanopyError, CanopyErrorCode } from "./errors";
import {
  isCanonicalMoveAddressFormat,
  isMoveAddressFormat,
  normalizeMoveAddressHex,
} from "../../shared/move-address-format.mjs";

export type HexString = `0x${string}`;
export type MoveAddress = HexString;

export function normalizeMoveAddress(address: string, label = "address"): HexString {
  if (!isMoveAddressFormat(address)) {
    throw new CanopyError("Invalid Move address", CanopyErrorCode.InvalidAddress, {
      address,
      label,
    });
  }

  return `0x${normalizeMoveAddressHex(address)}` as HexString;
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

export function isCanonicalMoveAddress(address: unknown): address is HexString {
  return typeof address === "string" && isCanonicalMoveAddressFormat(address);
}

export function assertCanonicalMoveAddress(
  address: unknown,
  label = "address"
): asserts address is HexString {
  if (!isCanonicalMoveAddress(address)) {
    throw new CanopyError(`Invalid ${label}`, CanopyErrorCode.InvalidAddress, {
      address,
    });
  }
}
