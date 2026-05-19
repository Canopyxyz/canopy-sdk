export const scaleToDecimals = (amount: string, decimals: number): bigint => {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFraction);
};

export const scaleFromDecimals = (amount: bigint, decimals: number): string => {
  const str = amount.toString().padStart(decimals + 1, "0");
  const insertPosition = str.length - decimals;
  const whole = str.slice(0, insertPosition) || "0";
  const fraction = str.slice(insertPosition).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
};

export const formatAddress = (address: string | { toString(): string }): string => {
  if (!address) return "";
  const addrStr = typeof address === "string" ? address : address.toString();
  if (!addrStr) return "";
  return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
};
