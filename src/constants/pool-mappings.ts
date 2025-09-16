/**
 * Static mapping of staking tokens to their corresponding pool addresses
 *
 * Key: staking token address
 * Value: array of pool addresses for that staking token
 */
// Why is this not complete?
export const STAKING_TOKEN_POOL_MAPPINGS: Record<string, string[]> = {
  "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02": [
    "0x7bf3653bf8b02d19b56916daaf959b95b4564ecd35d9abdb323d0690d5fdd0e7",
    "0xc1d2493f1ecc4ce35726fb0a48719752ce573f6aead45f35703193c021af3001",
  ],
  "0x3d871f7475a839376b5567de59807db876203c628f71c75dbeefdb60139a10f8": [
    "0x12d57c3d4bb2b73726196d5e112406220773cba576577a47b4b45db57e578411",
  ],
  "0x1d42fda1a3eac95ebcb4a35ba7f2c76c35855800c9fbf45a5255d146b5bac15": [
    "0xf7ce62c86bb4789e9f7b9a8effbe38e53aab6b28bd536ed5f0f898ae58a0df89",
    "0xff22e2f44b858bcfd6477ddf1e4ee561bbc4c2624eaa33c58a51eaecfc13087b",
  ],
};

/**
 * Check if a staking token has static pool mappings available
 */
export function hasStaticPoolMapping(stakingToken: string): boolean {
  return stakingToken in STAKING_TOKEN_POOL_MAPPINGS;
}

/**
 * Get static pool mappings for a staking token
 */
export function getStaticPoolMapping(stakingToken: string): string[] {
  return STAKING_TOKEN_POOL_MAPPINGS[stakingToken] || [];
}
