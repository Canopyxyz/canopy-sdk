import { normalizeMoveAddress } from "./address";
import { CanopyError, CanopyErrorCode } from "./errors";

export type MoveTypeTag = `${string}::${string}::${string}`;

export function normalizeMoveTypeTag(typeTag: string): MoveTypeTag {
  const parts = typeTag.split("::");

  if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
    throw new CanopyError("Invalid Move type tag", CanopyErrorCode.InvalidTypeTag, {
      typeTag,
    });
  }

  const address = parts[0].startsWith("@") ? parts[0].slice(1) : parts[0];
  return `${normalizeMoveAddress(address)}::${parts.slice(1).join("::")}` as MoveTypeTag;
}
