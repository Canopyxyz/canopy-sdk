import { defineErrorCause } from "../../shared/error-cause";

export enum CanopyErrorCode {
  InvalidAddress = "INVALID_ADDRESS",
  InvalidAmount = "INVALID_AMOUNT",
  InvalidDeployment = "INVALID_DEPLOYMENT",
  InvalidInput = "INVALID_INPUT",
  InvalidTypeTag = "INVALID_TYPE_TAG",
  MoveAbort = "MOVE_ABORT",
  NetworkError = "NETWORK_ERROR",
  TransactionBuildFailed = "TRANSACTION_BUILD_FAILED",
  ViewCallFailed = "VIEW_CALL_FAILED",
}

export type CanopyErrorDetails = Record<string, unknown>;

export interface CanopyErrorOptions {
  cause?: unknown;
}

export interface MoveAbortDetails {
  abortCode: number;
  abortMessage?: string;
  abortName?: string;
  errorCode?: string;
  function?: string;
  functionName?: string;
  module?: string;
  moduleAddress?: string;
  moduleName?: string;
  rawMessage: string;
  vmErrorCode?: number;
}

const KNOWN_MOVE_ABORTS: Record<string, { name: string; message: string }> = {
  "router::deposit:1": {
    name: "ENOT_ENOUGH_OUT_SHARES",
    message: "The deposit produced fewer shares than the caller required.",
  },
  "router::withdraw:1": {
    name: "EINVALID_ASSET_AMOUNT",
    message: "The withdrawal asset amount is invalid for this Meridian operation.",
  },
  "router::withdraw:3": {
    name: "ESLIPPAGE_SHARES_OUT",
    message: "The withdrawal would mint or redeem too few shares for the configured slippage.",
  },
  "router::withdraw:4": {
    name: "ESLIPPAGE_ASSETS_OUT",
    message: "The withdrawal would return fewer assets than the configured slippage floor.",
  },
  "router::withdraw:6": {
    name: "ENO_MATCH_COIN_DEPOSIT_FA",
    message: "The router could not match the requested coin and fungible-asset deposit path.",
  },
  "router::withdraw:9": {
    name: "EPRICE_OUT_OF_RANGE_PRE",
    message: "The pool price was already outside the allowed range before the withdrawal.",
  },
  "router::withdraw:10": {
    name: "EPRICE_OUT_OF_RANGE_POST",
    message: "The withdrawal would push the pool price outside the allowed range.",
  },
  "vault::deposit:113": {
    name: "EINVALID_DEPOSIT_AMOUNT",
    message: "The deposit amount is invalid for this vault.",
  },
  "vault::deposit:117": {
    name: "EVAULT_PAUSED",
    message: "The vault is currently paused and cannot accept deposits.",
  },
  "vault::withdraw:106": {
    name: "EINSUFFICIENT_BALANCE",
    message: "The account does not hold enough balance for this withdrawal.",
  },
  "vault::withdraw:129": {
    name: "ETOO_MUCH_LOSS",
    message: "The withdrawal exceeds the vault's allowed loss threshold.",
  },
  "withdraw::withdraw:0": {
    name: "EUNKNOWN_STRATEGY",
    message: "The router encountered a strategy it does not know how to unwind.",
  },
};

export class CanopyError extends Error {
  readonly code: CanopyErrorCode;
  readonly details: CanopyErrorDetails | undefined;
  readonly cause: unknown | undefined;

  constructor(
    message: string,
    code: CanopyErrorCode,
    details?: CanopyErrorDetails,
    options?: CanopyErrorOptions
  ) {
    super(message);
    this.name = "CanopyError";
    this.code = code;
    this.details = details;
    defineErrorCause(this, options?.cause);
  }

  toJSON(): {
    name: string;
    message: string;
    code: CanopyErrorCode;
    details?: CanopyErrorDetails;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export function extractMoveAbortDetails(
  error: unknown,
  fallbackFunction?: string
): MoveAbortDetails | undefined {
  const envelope = readErrorEnvelope(error);
  const rawMessage = envelope.message;

  if (!rawMessage || !/\babort\b/i.test(rawMessage)) {
    return undefined;
  }

  const abortCode = parseAbortCode(rawMessage);
  if (abortCode === undefined) {
    return undefined;
  }

  const fn = parseAbortFunction(rawMessage) ?? fallbackFunction;
  const [moduleAddress, moduleName, functionName] = fn ? fn.split("::") : [];
  const knownAbort =
    moduleName && functionName ? KNOWN_MOVE_ABORTS[`${moduleName}::${functionName}:${abortCode}`] : undefined;

  return {
    abortCode,
    ...(knownAbort ? { abortMessage: knownAbort.message, abortName: knownAbort.name } : {}),
    ...(envelope.errorCode ? { errorCode: envelope.errorCode } : {}),
    ...(fn ? { function: fn } : {}),
    ...(functionName ? { functionName } : {}),
    ...(moduleAddress && moduleName ? { module: `${moduleAddress}::${moduleName}` } : {}),
    ...(moduleAddress ? { moduleAddress } : {}),
    ...(moduleName ? { moduleName } : {}),
    rawMessage,
    ...(envelope.vmErrorCode !== undefined ? { vmErrorCode: envelope.vmErrorCode } : {}),
  };
}

export function isCanopyError(error: unknown): error is CanopyError {
  return (
    error instanceof CanopyError ||
    (error instanceof Error &&
      Object.values(CanopyErrorCode).includes(
        (error as { code?: unknown }).code as CanopyErrorCode
      ))
  );
}

function parseAbortCode(message: string): number | undefined {
  const match =
    message.match(/abort code\s+(0x[0-9a-fA-F]+|\d+)/i) ??
    message.match(/\bcode[:\s]+(0x[0-9a-fA-F]+|\d+)\b/i);

  if (!match) {
    return undefined;
  }

  const rawCode = match[1];
  return rawCode ? parseInteger(rawCode) : undefined;
}

function parseAbortFunction(message: string): string | undefined {
  const match =
    message.match(
      /Move abort in\s+((?:0x)?[0-9a-fA-F]{1,64}::[A-Za-z0-9_]+::[A-Za-z0-9_]+)/i
    ) ??
    message.match(
      /at function\s+((?:0x)?[0-9a-fA-F]{1,64}::[A-Za-z0-9_]+::[A-Za-z0-9_]+)/i
    );

  if (!match) {
    return undefined;
  }

  const functionId = match[1];
  if (!functionId) {
    return undefined;
  }

  const [rawAddress, moduleName, functionName] = functionId.split("::");
  if (!rawAddress || !moduleName || !functionName) {
    return undefined;
  }

  return `${normalizeHexAddress(rawAddress)}::${moduleName}::${functionName}`;
}

function parseInteger(value: string): number | undefined {
  const parsed = value.startsWith("0x") || value.startsWith("0X") ? Number.parseInt(value, 16) : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readErrorEnvelope(error: unknown): {
  errorCode?: string;
  message?: string;
  vmErrorCode?: number;
} {
  const record = asRecord(error);
  const data = asRecord(record?.data);
  const errorCode = readString(record?.error_code) ?? readString(data?.error_code);
  const message = readString(data?.message) ?? readString(record?.message);
  const vmErrorCode = readNumber(record?.vm_error_code) ?? readNumber(data?.vm_error_code);

  return {
    ...(errorCode !== undefined ? { errorCode } : {}),
    ...(message !== undefined ? { message } : {}),
    ...(vmErrorCode !== undefined ? { vmErrorCode } : {}),
  };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    return parseInteger(value);
  }

  return undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function normalizeHexAddress(address: string): string {
  const input = address.startsWith("0x") ? address.slice(2) : address;
  return `0x${input.padStart(64, "0").toLowerCase()}`;
}
