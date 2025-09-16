// Utility functions for decimal scaling

export const scaleToDecimals = (amount: string, decimals: number): bigint => {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  const scaled = whole + paddedFraction;
  return BigInt(scaled);
};

export const scaleFromDecimals = (amount: bigint, decimals: number): string => {
  const str = amount.toString().padStart(decimals + 1, '0');
  const insertPosition = str.length - decimals;
  const whole = str.slice(0, insertPosition) || '0';
  const fraction = str.slice(insertPosition);
  
  // Remove trailing zeros from fraction
  const trimmedFraction = fraction.replace(/0+$/, '');
  
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
};

export const formatAddress = (address: string | any): string => {
  if (!address) return '';
  // Handle both string and object address formats
  const addrStr = typeof address === 'string' ? address : address.toString();
  if (!addrStr) return '';
  return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
};