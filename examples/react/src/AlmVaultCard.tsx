import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { Movement } from "@moveindustries/ts-sdk";
import type { CanopySdk, MeridianVaultSummary } from "@canopyhub/canopy-sdk";
import { scaleToDecimals, scaleFromDecimals } from "./utils";

const DECIMALS = 8;

interface Props {
  sdk: CanopySdk;
  movementClient: Movement;
  vault: MeridianVaultSummary;
}

interface Balances {
  depositAssetWallet: bigint;
  shares: bigint;
}

export default function AlmVaultCard({ sdk, movementClient, vault }: Props) {
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
      const [assetResult, position] = await Promise.all([
        movementClient.view({
          payload: {
            function: "0x1::primary_fungible_store::balance" as `${string}::${string}::${string}`,
            typeArguments: ["0x1::fungible_asset::Metadata"],
            functionArguments: [userAddress, vault.depositAssetAddress],
          },
        }),
        sdk.alm.meridian?.getUserVaultPosition(vault.vaultAddress, userAddress),
      ]);

      setBalances({
        depositAssetWallet: BigInt((assetResult as string[])[0] ?? "0"),
        shares: position?.shares ?? 0n,
      });
    } catch (error) {
      console.error(`Failed to fetch ALM balances for ${vault.vaultAddress}:`, error);
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
      const pending = await signAndSubmitTransaction({ data: payload });
      await movementClient.waitForTransaction({ transactionHash: pending.hash });
      setStatus(`${label} successful! TX: ${pending.hash}`);
      setTimeout(fetchBalances, 2000);
    } catch (error: unknown) {
      setStatus(`${label} failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = () =>
    submit("Deposit", () =>
      Promise.resolve(
        sdk.alm.meridian!.buildDepositPayload({
          vaultAddress: vault.vaultAddress,
          amount: scaleToDecimals(depositAmount, DECIMALS),
          minSharesOut: 0n,
        })
      )
    );

  const handleWithdraw = () =>
    submit("Withdraw", () =>
      Promise.resolve(
        sdk.alm.meridian!.buildWithdrawPayload({
          vaultAddress: vault.vaultAddress,
          shares: scaleToDecimals(sharesAmount, DECIMALS),
          maxLossBps: 0n,
          minAmountOut: 0n,
        })
      )
    );

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "12px" }}>
        <strong>ALM Vault</strong>
        <div style={{ fontSize: "0.8em", color: "#aaa", marginTop: "4px" }}>
          <span>Deposit: </span>
          <span style={{ fontFamily: "monospace" }}>{vault.depositAssetAddress}</span>
        </div>
        <div style={{ fontSize: "0.8em", color: "#aaa" }}>
          <span>Quote: </span>
          <span style={{ fontFamily: "monospace" }}>{vault.quoteAssetAddress}</span>
        </div>
        <div style={{ fontSize: "0.75em", color: "#666", marginTop: "2px", fontFamily: "monospace" }}>
          {vault.vaultAddress}
        </div>
      </div>

      {account && balances && (
        <div style={gridStyle}>
          <Stat label="Wallet" value={scaleFromDecimals(balances.depositAssetWallet, DECIMALS)} unit="deposit" />
          <Stat label="Shares" value={scaleFromDecimals(balances.shares, DECIMALS)} />
          <Stat label="Price" value={(Number(vault.sharePriceE18) / 1e18).toFixed(6)} unit="e18" />
        </div>
      )}

      {account && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={rowStyle}>
            <label style={labelStyle}>Amount:</label>
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
            <label style={labelStyle}>Shares:</label>
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
  gridTemplateColumns: "repeat(3, 1fr)",
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
