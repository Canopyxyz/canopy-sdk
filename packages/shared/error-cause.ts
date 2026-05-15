export function defineErrorCause(target: Error, cause: unknown): void {
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
