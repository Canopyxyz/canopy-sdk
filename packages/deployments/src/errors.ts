export const INVALID_DEPLOYMENT = "INVALID_DEPLOYMENT";

export type DeploymentErrorDetails = Record<string, unknown>;

export interface DeploymentErrorOptions {
  cause?: unknown;
}

export class DeploymentError extends Error {
  readonly code = INVALID_DEPLOYMENT;
  readonly details: DeploymentErrorDetails | undefined;
  readonly cause: unknown | undefined;

  constructor(
    message: string,
    details?: DeploymentErrorDetails,
    options?: DeploymentErrorOptions
  ) {
    super(message);
    this.name = "DeploymentError";
    this.details = details;
    this.cause = options?.cause;
  }

  toJSON(): {
    name: string;
    message: string;
    code: typeof INVALID_DEPLOYMENT;
    details?: DeploymentErrorDetails;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}
