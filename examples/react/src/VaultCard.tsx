import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { Movement } from "@moveindustries/ts-sdk";
import type { CanopySdk, CanopyVaultView } from "@canopyhub/canopy-sdk";
import { scaleToDecimals, scaleFromDecimals } from "./utils";

interface Props {
  sdk: CanopySdk;
  movementClient: Movement;
  vault: CanopyVaultView;
  strategyNames: Record<string, string>;
}

interface Balances {
  assetWallet: bigint;
  sharesWallet: bigint;
  sharesStaked: bigint;
  rewards: bigint;
  rewardTokenAddresses: string[];
}

export default function VaultCard({ sdk, movementClient, vault, strategyNames }: Props) {
  const { account, signAndSubmitTransaction } = useWallet();
  const [balances, setBalances] = useState<Balances | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [sharesAmount, setSharesAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const userAddress = account?.address?.toString() ?? "";

  const fetchBalances = useCallback(async () => {
    if (!userAddress) {
      setBalances(null);
      return;
    }

    try {
      const [assetResult, vaultPosition, stakingPosition] = await Promise.all([
        movementClient.view({
          payload: {
            function: "0x1::primary_fungible_store::balance" as `${string}::${string}::${string}`,
            typeArguments: ["0x1::fungible_asset::Metadata"],
            functionArguments: [userAddress, vault.assetAddress],
          },
        }),
        sdk.canopy?.getUserVaultPosition(userAddress, vault.vaultAddress),
        sdk.rewards?.getUserStakingPosition({
          userAddress,
          stakingAsset: vault.sharesAddress,
        }),
      ]);

      setBalances({
        assetWallet: BigInt((assetResult as string[])[0] ?? "0"),
        sharesWallet: vaultPosition?.sharesBalance ?? 0n,
        sharesStaked: stakingPosition?.totalStaked ?? 0n,
        rewards: stakingPosition?.pendingRewards.reduce((acc, r) => acc + r.amount, 0n) ?? 0n,
        rewardTokenAddresses: stakingPosition?.pendingRewards.map((r) => r.rewardTokenAddress) ?? [],
      });
    } catch (error) {
      console.error(`Failed to fetch balances for ${vault.assetName}:`, error);
    }
  }, [userAddress, vault, sdk, movementClient]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const submit = async (label: string, buildPayload: () => Promise<unknown>) => {
    setLoading(true);
    setStatus(`${label}...`);
    try {
      const payload = await buildPayload();
      // @ts-expect-error
      const response = await signAndSubmitTransaction({ data: payload });
      setStatus(`${label} successful! TX: ${response.hash}`);
      setTimeout(fetchBalances, 2000);
    } catch (error: unknown) {
      setStatus(`${label} failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = () =>
    submit("Deposit", () =>
      sdk.canopy!.buildDepositPayload({
        vaultAddress: vault.vaultAddress,
        amount: scaleToDecimals(depositAmount, vault.decimals),
        minSharesOut: 0n,
      })
    );

  const handleWithdraw = () =>
    submit("Withdraw", () =>
      sdk.canopy!.buildWithdrawPayload({
        vaultAddress: vault.vaultAddress,
        shares: scaleToDecimals(sharesAmount, vault.decimals),
        maxLossBps: 0n,
        minAmountOut: 0n,
      })
    );

  const handleStake = () =>
    submit("Stake", () =>
      sdk.rewards!.buildStakeVaultSharesPayload({
        stakingAsset: vault.sharesAddress,
        amount: scaleToDecimals(sharesAmount, vault.decimals),
        userAddress,
      })
    );

  const handleUnstake = () =>
    submit("Unstake", () =>
      Promise.resolve(
        sdk.rewards!.buildWithdrawAssetPayload({
          stakingAsset: vault.sharesAddress,
          amount: scaleToDecimals(sharesAmount, vault.decimals),
        })
      )
    );

  const handleClaim = () =>
    submit("Claim rewards", () =>
      Promise.resolve(
        sdk.rewards!.buildClaimRewardsPayload({
          rewardTokenAddresses: balances?.rewardTokenAddresses ?? [],
        })
      )
    );

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "12px" }}>
        <strong>{vault.assetName}</strong>
        <span style={{ color: "#888", marginLeft: "8px", fontSize: "0.85em" }}>
          shares: {vault.sharesName}
        </span>
        {vault.strategies.length > 0 && (
          <span style={{ marginLeft: "8px", fontSize: "0.75em" }}>
            {vault.strategies
              .map((s) => strategyNames[s.concreteAddress] ?? s.concreteAddress.slice(0, 8))
              .join(", ")}
          </span>
        )}
        <div style={{ fontSize: "0.75em", color: "#888", marginTop: "2px", fontFamily: "monospace" }}>
          {vault.vaultAddress}
        </div>
      </div>

      {account && balances && (
        <div style={gridStyle}>
          <Stat label="Wallet" value={scaleFromDecimals(balances.assetWallet, vault.decimals)} unit={vault.assetName} />
          <Stat label="Deposited" value={scaleFromDecimals(balances.sharesWallet, vault.decimals)} unit={vault.sharesName} />
          <Stat label="Staked" value={scaleFromDecimals(balances.sharesStaked, vault.decimals)} unit={vault.sharesName} />
          <Stat label="Rewards" value={scaleFromDecimals(balances.rewards, 8)} />
        </div>
      )}

      {account && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={rowStyle}>
            <label style={labelStyle}>{vault.assetName}:</label>
            <input
              style={inputStyle}
              type="text"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.0"
              disabled={loading}
            />
            <button onClick={handleDeposit} disabled={loading || !depositAmount}>
              Deposit
            </button>
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>{vault.sharesName}:</label>
            <input
              style={inputStyle}
              type="text"
              value={sharesAmount}
              onChange={(e) => setSharesAmount(e.target.value)}
              placeholder="0.0"
              disabled={loading}
            />
            <button onClick={handleWithdraw} disabled={loading || !sharesAmount}>
              Withdraw
            </button>
            <button onClick={handleStake} disabled={loading || !sharesAmount}>
              Stake
            </button>
            <button onClick={handleUnstake} disabled={loading || !sharesAmount}>
              Unstake
            </button>
            <button
              onClick={handleClaim}
              disabled={loading || !balances || balances.rewards === 0n}
            >
              Claim Rewards
            </button>
          </div>
        </div>
      )}

      {status && (
        <p style={{ marginTop: "8px", fontSize: "0.85em", color: "#aaa" }}>{status}</p>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.75em", color: "#888", marginBottom: "2px" }}>{label}</div>
      <div>
        {value} {unit && <span style={{ fontSize: "0.8em", color: "#aaa" }}>{unit}</span>}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  textAlign: "left",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginBottom: "16px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85em",
  width: "80px",
  textAlign: "right",
  flexShrink: 0,
};

const inputStyle: React.CSSProperties = {
  width: "100px",
  padding: "4px 8px",
};
