export const MOVE_ADDRESS_HEX_RE: RegExp;
export const CANONICAL_MOVE_ADDRESS_HEX_RE: RegExp;

export function stripMoveAddressPrefix(address: string): string;
export function isMoveAddressFormat(address: string): boolean;
export function isCanonicalMoveAddressFormat(address: string): boolean;
export function normalizeMoveAddressHex(address: string): string;
