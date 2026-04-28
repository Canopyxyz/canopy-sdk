export enum CanopyErrorCode {
  InvalidAddress = "INVALID_ADDRESS",
  InvalidAmount = "INVALID_AMOUNT",
  InvalidDeployment = "INVALID_DEPLOYMENT",
  InvalidInput = "INVALID_INPUT",
  InvalidTypeTag = "INVALID_TYPE_TAG",
  NetworkError = "NETWORK_ERROR",
  TransactionBuildFailed = "TRANSACTION_BUILD_FAILED",
  ViewCallFailed = "VIEW_CALL_FAILED",
}

export type CanopyErrorDetails = Record<string, unknown>;

export interface CanopyErrorOptions {
  cause?: unknown;
}

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
    this.cause = options?.cause;
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

export function isCanopyError(error: unknown): error is CanopyError {
  return (
    error instanceof CanopyError ||
    (error instanceof Error &&
      Object.values(CanopyErrorCode).includes(
        (error as { code?: unknown }).code as CanopyErrorCode
      ))
  );
}
