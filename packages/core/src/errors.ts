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

function defineErrorCause(target: Error, cause: unknown): void {
  if (cause === undefined) {
    return;
  }

  Object.defineProperty(target, "cause", {
    value: cause,
    enumerable: false,
    configurable: true,
    writable: true,
  });
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

/** An abort's name and description, from either the chain or `KNOWN_MOVE_ABORTS`. */
interface AbortDescription {
  abortMessage?: string;
  abortName: string;
}

/** Where an abort happened. `functionName` is absent when only a module is known. */
interface AbortLocation {
  functionName?: string;
  moduleAddress: string;
  moduleName: string;
}

const KNOWN_MOVE_ABORTS: Record<string, { name: string; message: string }> = {
  "router::deposit_coin:1": {
    name: "ENOT_ENOUGH_OUT_SHARES",
    message: "The deposit produced fewer shares than the caller required.",
  },
  "router::deposit_fa:1": {
    name: "ENOT_ENOUGH_OUT_SHARES",
    message: "The deposit produced fewer shares than the caller required.",
  },
  "router::deposit_fa_with_coin_type:1": {
    name: "ENOT_ENOUGH_OUT_SHARES",
    message: "The deposit produced fewer shares than the caller required.",
  },
  "router::withdraw_coin:2": {
    name: "ENOT_ENOUGH_OUT_AMOUNT",
    message: "The withdrawal would return fewer assets than the caller required.",
  },
  "router::withdraw_fa:2": {
    name: "ENOT_ENOUGH_OUT_AMOUNT",
    message: "The withdrawal would return fewer assets than the caller required.",
  },
  "router::withdraw_fa_with_coin_type:2": {
    name: "ENOT_ENOUGH_OUT_AMOUNT",
    message: "The withdrawal would return fewer assets than the caller required.",
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

  // `ABORTED` has no word boundary before `ED`, so `\babort\b` alone rejects every
  // `/v1/view` failure before it is ever parsed.
  if (!rawMessage || !/\babort(ed)?\b/i.test(rawMessage)) {
    return undefined;
  }

  // Three shapes reach this function, and none of the endpoints agree:
  //   - `/v1/view`  → `VMError { major_status: ABORTED, sub_status: Some(2), ... }`
  //   - simulation  → `Move abort in 0xaddr::module: ENAME(0x65): description`
  //   - Aptos       → `Move abort in 0xaddr::module::function: abort code 117`
  // Most specific first. The bare-code patterns are loose enough to match an unrelated
  // `code` elsewhere in the same string, so they run last.
  const namedAbort = parseNamedAbort(rawMessage);
  const abortCode =
    namedAbort?.abortCode ?? parseVmErrorAbort(rawMessage) ?? parseAbortCode(rawMessage);
  if (abortCode === undefined) {
    return undefined;
  }

  const location = resolveAbortLocation(rawMessage, fallbackFunction);
  const { functionName, moduleAddress, moduleName } = location ?? {};
  // The chain's own name and message beat the hand-maintained table whenever it sends
  // them. The table only covers the Aptos form, which carries neither.
  const knownAbort =
    namedAbort ?? lookupKnownMoveAbort(moduleName, functionName, abortCode);

  return {
    abortCode,
    ...(knownAbort?.abortMessage ? { abortMessage: knownAbort.abortMessage } : {}),
    ...(knownAbort?.abortName ? { abortName: knownAbort.abortName } : {}),
    ...(envelope.errorCode ? { errorCode: envelope.errorCode } : {}),
    // Only a complete `address::module::function` id is reported. A module-only abort
    // has no function to name, and callers already receive the payload's own function
    // id alongside `moveAbort`.
    ...(moduleAddress && moduleName && functionName
      ? { function: `${moduleAddress}::${moduleName}::${functionName}` }
      : {}),
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

/**
 * Reads the `ENAME(0xHEX): message` tail that Movement fullnodes append to an abort, e.g.
 * `EDEPOSIT_BELOW_MIN(0x65): Deposit amount is below the minimum required.`
 *
 * The trailing message is optional — some modules abort with a named constant and no
 * description.
 */
function parseNamedAbort(
  message: string
): (AbortDescription & { abortCode: number }) | undefined {
  const match = message.match(
    /\b(E[A-Za-z0-9_]*)\((0x[0-9a-fA-F]+|\d+)\)(?:\s*:\s*(.+))?/
  );

  if (!match) {
    return undefined;
  }

  const [, abortName, rawCode, abortMessage] = match;
  if (!abortName || !rawCode) {
    return undefined;
  }

  const abortCode = parseInteger(rawCode);
  if (abortCode === undefined) {
    return undefined;
  }

  const trimmedMessage = abortMessage?.trim();

  return {
    abortCode,
    abortName,
    ...(trimmedMessage ? { abortMessage: trimmedMessage } : {}),
  };
}

/**
 * Reads the `VMError { major_status: ABORTED, sub_status: Some(N) }` shape `/v1/view`
 * returns. A view abort carries neither a name nor a description — only the code, and only
 * in `sub_status`.
 *
 * Gated on `major_status: ABORTED` so a non-abort VM failure is not misread as a Move
 * abort. That gate is load-bearing: a missing object reports the bare string
 * `PartialVMError with status ABORTED`, which passes the `abort(ed)?` guard above but
 * carries no code and must stay a plain view failure.
 */
function parseVmErrorAbort(message: string): number | undefined {
  if (!/major_status:\s*ABORTED\b/.test(message)) {
    return undefined;
  }

  const match = message.match(/sub_status:\s*Some\((0x[0-9a-fA-F]+|\d+)\)/);
  return match?.[1] ? parseInteger(match[1]) : undefined;
}

/**
 * Locates an abort, preferring what the chain reported over the caller's payload.
 *
 * Movement names only the aborting module (`0xaddr::vault`), which is frequently an inner
 * module the caller never invoked directly — a router entry function aborting inside a
 * vault. `fallbackFunction` supplies a function name only when it refers to that very same
 * module: matching on the bare module name would let `0xa::vault` adopt a function from an
 * unrelated `0xb::vault`, inventing a function id that does not exist.
 */
function resolveAbortLocation(
  message: string,
  fallbackFunction?: string
): AbortLocation | undefined {
  const reported = parseAbortLocation(message);

  if (!reported) {
    return fallbackFunction ? parseFunctionId(fallbackFunction) : undefined;
  }

  if (reported.functionName || !fallbackFunction) {
    return reported;
  }

  const fallback = parseFunctionId(fallbackFunction);
  const sameModule =
    fallback?.moduleAddress === reported.moduleAddress &&
    fallback?.moduleName === reported.moduleName;

  return sameModule && fallback?.functionName
    ? { ...reported, functionName: fallback.functionName }
    : reported;
}

function parseAbortLocation(message: string): AbortLocation | undefined {
  const functionMatch =
    message.match(
      /Move abort in\s+((?:0x)?[0-9a-fA-F]{1,64}::[A-Za-z0-9_]+::[A-Za-z0-9_]+)/i
    ) ??
    message.match(
      /at function\s+((?:0x)?[0-9a-fA-F]{1,64}::[A-Za-z0-9_]+::[A-Za-z0-9_]+)/i
    ) ??
    // `/v1/view` is the one endpoint that names the function: it reports a complete id
    // inside VMError's inner message, as `message: Some("0xaddr::module::fn at offset 17")`.
    message.match(
      /message:\s*Some\("((?:0x)?[0-9a-fA-F]{1,64}::[A-Za-z0-9_]+::[A-Za-z0-9_]+)/i
    );

  if (functionMatch?.[1]) {
    return parseFunctionId(functionMatch[1]);
  }

  // Movement stops at the module: `Move abort in 0xaddr::vault: ENAME(0x65): ...`
  const moduleMatch = message.match(
    /Move abort in\s+((?:0x)?[0-9a-fA-F]{1,64})::([A-Za-z0-9_]+)/i
  );
  const [, rawAddress, moduleName] = moduleMatch ?? [];

  if (!rawAddress || !moduleName) {
    return undefined;
  }

  return { moduleAddress: normalizeHexAddress(rawAddress), moduleName };
}

function parseFunctionId(functionId: string): AbortLocation | undefined {
  const [rawAddress, moduleName, functionName] = functionId.split("::");
  if (!rawAddress || !moduleName || !functionName) {
    return undefined;
  }

  return { functionName, moduleAddress: normalizeHexAddress(rawAddress), moduleName };
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

function lookupKnownMoveAbort(
  moduleName: string | undefined,
  functionName: string | undefined,
  abortCode: number
): AbortDescription | undefined {
  if (!functionName) {
    return undefined;
  }

  if (moduleName) {
    const exact = KNOWN_MOVE_ABORTS[`${moduleName}::${functionName}:${abortCode}`];
    if (exact) {
      return describeKnownAbort(exact);
    }
  }

  const exactByFunction = Object.entries(KNOWN_MOVE_ABORTS).find(([key]) =>
    key.endsWith(`::${functionName}:${abortCode}`)
  )?.[1];

  // No prefix heuristics. `deposit_*` + code 1 and `withdraw_*` + code 2 used to fall back
  // to the router's slippage errors, which is redundant for every router function above —
  // they all have exact keys — and wrong for anything else that happens to share the
  // prefix. A curator `vault::deposit_preview` aborting with code 1 was reported as
  // "The deposit produced fewer shares than the caller required." An unnamed code beats a
  // confident wrong name.
  return exactByFunction ? describeKnownAbort(exactByFunction) : undefined;
}

function describeKnownAbort(entry: { name: string; message: string }): AbortDescription {
  return { abortMessage: entry.message, abortName: entry.name };
}
