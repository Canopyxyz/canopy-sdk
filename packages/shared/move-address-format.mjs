export const MOVE_ADDRESS_HEX_RE = /^[0-9a-fA-F]{1,64}$/;
export const CANONICAL_MOVE_ADDRESS_HEX_RE = /^[0-9a-fA-F]{64}$/;

export function stripMoveAddressPrefix(address) {
  return address.startsWith("0x") ? address.slice(2) : address;
}

export function isMoveAddressFormat(address) {
  return MOVE_ADDRESS_HEX_RE.test(stripMoveAddressPrefix(address));
}

export function isCanonicalMoveAddressFormat(address) {
  return CANONICAL_MOVE_ADDRESS_HEX_RE.test(stripMoveAddressPrefix(address));
}

export function normalizeMoveAddressHex(address) {
  return stripMoveAddressPrefix(address).toLowerCase().padStart(64, "0");
}
