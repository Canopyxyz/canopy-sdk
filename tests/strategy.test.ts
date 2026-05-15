import {
  getCanopyStrategyContractId,
  getCanopyStrategyDisplayName,
  inferCanopyStrategyContractId,
  inferCanopyStrategyProtocol,
  requireCanopyStrategyContract,
} from "../packages/sdk/src";

describe("strategy helpers", () => {
  it("maps strategy protocols to stable contract ids and display names", () => {
    expect(getCanopyStrategyContractId("moveposition")).toBe(
      "canopy.strategy.movepositionSimple"
    );
    expect(getCanopyStrategyDisplayName("layerbank")).toBe(
      "LayerBank Simple"
    );
  });

  it("infers canopy strategy protocols from deployed addresses", () => {
    expect(
      inferCanopyStrategyProtocol(
        "movement-mainnet",
        "0xad1b34939f164ec6f6c0157da3a30bf9e5d408250978691872a79aa584852b85"
      )
    ).toEqual({ kind: "known", protocol: "layerbank" });
    expect(
      inferCanopyStrategyContractId(
        "aptos-testnet",
        "0x0374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab"
      )
    ).toBe("canopy.strategy.movepositionSimple");
  });

  it("returns an explicit unknown result for unknown or unavailable strategy addresses", () => {
    expect(
      inferCanopyStrategyProtocol(
        "movement-testnet",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      )
    ).toEqual({
      kind: "unknown",
      address: "0x0000000000000000000000000000000000000000000000000000000000000001",
    });
    expect(
      inferCanopyStrategyContractId(
        "movement-testnet",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      )
    ).toBeNull();
  });

  it("exposes a require helper with the same missing-deployment semantics", () => {
    expect(
      requireCanopyStrategyContract("movement-mainnet", "layerbank")
    ).toMatchObject({
      id: "canopy.strategy.layerbankSimple",
      chain: "movement-mainnet",
    });

    expect(() =>
      requireCanopyStrategyContract("movement-testnet", "layerbank")
    ).toThrow(
      'Contract "canopy.strategy.layerbankSimple" is not deployed on "movement-testnet"'
    );
  });
});
