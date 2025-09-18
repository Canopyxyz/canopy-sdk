import { AccountAddress } from "@aptos-labs/ts-sdk";
import { CanopyError, CanopyErrorCode } from "../types";
import { ERROR_MESSAGES } from "../constants";

/**
 * Validates if a string is a valid Aptos address
 * Accepts addresses with or without "0x" prefix
 * Validates hex content and length (1-64 hex chars)
 * @param address The address to validate
 * @returns true if valid, false otherwise
 */
export function isValidAddress(address: unknown): boolean {
  if (!address || typeof address !== "string") {
    return false;
  }
  
  try {
    AccountAddress.from(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates an address and throws an error if invalid
 * @param address The address to validate
 * @param addressType The type of address for error messaging
 * @throws CanopyError if address is invalid
 */
export function validateAddress(
  address: unknown,
  addressType: "vault" | "user" | "token" | "pool" | "strategy"
): void {
  if (!address || typeof address !== "string") {
    const errorCode = getErrorCodeForAddressType(addressType);
    throw new CanopyError(
      `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address is required and must be a string`,
      errorCode,
      { address }
    );
  }

  if (!isValidAddress(address)) {
    const errorCode = getErrorCodeForAddressType(addressType);
    throw new CanopyError(
      `Invalid ${addressType} address format`,
      errorCode,
      { address }
    );
  }
}

/**
 * Validates an amount value
 * @param amount The amount to validate
 * @param operation The operation name for error messaging
 * @throws CanopyError if amount is invalid
 */
export function validateAmount(amount: unknown, operation: string): void {
  if (typeof amount !== "bigint") {
    throw new CanopyError(
      `${operation} ${ERROR_MESSAGES.AMOUNT_MUST_BE_BIGINT}`,
      CanopyErrorCode.AMOUNT_TOO_SMALL,
      { amount }
    );
  }

  if (amount <= 0n) {
    throw new CanopyError(
      `${operation} ${ERROR_MESSAGES.AMOUNT_TOO_SMALL}`,
      CanopyErrorCode.AMOUNT_TOO_SMALL,
      { amount: amount.toString() }
    );
  }
}

/**
 * Validates vault address and amount together
 * Common validation for deposit/withdraw operations
 */
export function validateVaultInputs(
  vaultAddress: unknown,
  amount: unknown,
  operation: string
): void {
  validateAddress(vaultAddress, "vault");
  validateAmount(amount, operation);
}

/**
 * Validates an array of addresses
 * @param addresses Array of addresses to validate
 * @param addressType The type of addresses for error messaging
 * @throws CanopyError if any address is invalid
 */
export function validateAddressArray(
  addresses: unknown,
  addressType: "token" | "pool"
): void {
  if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
    throw new CanopyError(
      `At least one ${addressType} address is required`,
      CanopyErrorCode.INVALID_INPUT,
      { addresses }
    );
  }

  addresses.forEach((address, index) => {
    if (!address || typeof address !== "string") {
      const errorCode = getErrorCodeForAddressType(addressType);
      throw new CanopyError(
        `Each ${addressType} address must be a string`,
        errorCode,
        { address, index }
      );
    }

    if (!isValidAddress(address)) {
      const errorCode = getErrorCodeForAddressType(addressType);
      throw new CanopyError(
        `Invalid ${addressType} address format at index ${index}`,
        errorCode,
        { address, index }
      );
    }
  });
}

/**
 * Helper to get the appropriate error code for an address type
 */
function getErrorCodeForAddressType(
  addressType: "vault" | "user" | "token" | "pool" | "strategy"
): CanopyErrorCode {
  switch (addressType) {
    case "vault":
    case "strategy":
      return CanopyErrorCode.INVALID_VAULT_ADDRESS;
    case "user":
      return CanopyErrorCode.INVALID_USER_ADDRESS;
    case "token":
      return CanopyErrorCode.INVALID_TOKEN_ADDRESS;
    case "pool":
      return CanopyErrorCode.INVALID_POOL_ADDRESS;
    default:
      return CanopyErrorCode.INVALID_INPUT;
  }
}

/**
 * Normalizes an address to a consistent format
 * @param address The address to normalize
 * @returns The normalized address string or null if invalid
 */
export function normalizeAddress(address: string): string | null {
  try {
    const accountAddress = AccountAddress.from(address);
    return accountAddress.toString();
  } catch {
    return null;
  }
}