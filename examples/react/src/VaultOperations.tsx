import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { scaleToDecimals, scaleFromDecimals, formatAddress } from "./utils";
import type { CanopyClient } from "@canopyhub/canopy-sdk";

export default function VaultOperations({
  canopyClient,
}: {
  canopyClient: CanopyClient;
}) {
  const { account, signAndSubmitTransaction } = useWallet();
  const [vaults, setVaults] = useState<any[]>([]);
  const [selectedVault, setSelectedVault] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [userPosition, setUserPosition] = useState<{
    sharesBalance: string;
    assetValue: string;
  } | null>(null);

  // Fetch available vaults
  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const vaultList = await canopyClient.getVaults();
        setVaults(vaultList || []);
      } catch (error) {
        console.error("Failed to fetch vaults:", error);
      }
    };

    fetchVaults();
  }, []);

  // Fetch user vault position when vault is selected
  useEffect(() => {
    if (!account || !selectedVault) {
      setUserPosition(null);
      return;
    }

    const fetchVaultPosition = async () => {
      try {
        const userAddress = account.address?.toString() || account.toString();
        const position = await canopyClient.getUserVaultPosition(
          userAddress,
          selectedVault
        );

        // Get vault details for decimals
        const vault = vaults.find((v) => v.address === selectedVault);
        const decimals = vault?.decimals || 8;

        setUserPosition({
          sharesBalance: scaleFromDecimals(
            BigInt(position.sharesBalance),
            decimals
          ),
          assetValue: scaleFromDecimals(BigInt(position.assetValue), decimals),
        });
      } catch (error) {
        console.error("Failed to fetch vault position:", error);
        setUserPosition({ sharesBalance: "0", assetValue: "0" });
      }
    };

    fetchVaultPosition();
  }, [account, selectedVault, vaults, canopyClient]);

  const handleDeposit = async () => {
    if (!account || !selectedVault || !amount || !canopyClient) {
      setStatus("Please connect wallet, select vault, and enter amount");
      return;
    }

    setLoading(true);
    setStatus("Processing deposit...");

    try {
      const vault = vaults.find((v) => v.address === selectedVault);
      if (!vault) throw new Error("Vault not found");

      // Scale amount by decimals (using base asset decimals for deposit)
      const decimals = vault.baseAssetDecimals || 8;
      const scaledAmount = scaleToDecimals(amount, decimals);

      // Build deposit transaction
      const payload = await canopyClient.deposit(selectedVault, scaledAmount);

      // Submit transaction
      const response = await signAndSubmitTransaction({
        // @ts-expect-error
        data: payload,
      });

      setStatus(`Deposit successful! TX: ${response.hash}`);
      setAmount("");

      // Refresh vault position after a short delay
      setTimeout(() => {
        if (account && selectedVault) {
          const refreshPosition = async () => {
            try {
              const userAddress =
                account.address?.toString() || account.toString();
              const position = await canopyClient.getUserVaultPosition(
                userAddress,
                selectedVault
              );
              const vault = vaults.find((v) => v.address === selectedVault);
              const decimals = vault?.sharesAssetDecimals || 8;
              setUserPosition({
                sharesBalance: scaleFromDecimals(
                  BigInt(position.sharesBalance),
                  decimals
                ),
                assetValue: scaleFromDecimals(
                  BigInt(position.assetValue),
                  decimals
                ),
              });
            } catch (error) {
              console.error("Failed to refresh vault position:", error);
            }
          };
          refreshPosition();
        }
      }, 2000);
    } catch (error: any) {
      setStatus(`Deposit failed: ${error.message}`);
      console.error("Deposit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!account || !selectedVault || !amount || !canopyClient) {
      setStatus("Please connect wallet, select vault, and enter amount");
      return;
    }

    setLoading(true);
    setStatus("Processing withdrawal...");

    try {
      const vault = vaults.find((v) => v.address === selectedVault);
      if (!vault) throw new Error("Vault not found");

      // Scale amount by decimals (for shares)
      const decimals = vault.decimals || 8;
      const scaledAmount = scaleToDecimals(amount, decimals);

      // Build withdrawal transaction
      const payload = await canopyClient.withdraw(selectedVault, scaledAmount);

      // Submit transaction
      const response = await signAndSubmitTransaction({
        // @ts-expect-error
        data: payload,
      });

      setStatus(`Withdrawal successful! TX: ${response.hash}`);
      setAmount("");

      // Refresh vault position after a short delay
      setTimeout(() => {
        if (account && selectedVault) {
          const refreshPosition = async () => {
            try {
              const userAddress =
                account.address?.toString() || account.toString();
              const position = await canopyClient.getUserVaultPosition(
                userAddress,
                selectedVault
              );
              const vault = vaults.find((v) => v.address === selectedVault);
              const decimals = vault?.sharesAssetDecimals || 8;
              setUserPosition({
                sharesBalance: scaleFromDecimals(
                  BigInt(position.sharesBalance),
                  decimals
                ),
                assetValue: scaleFromDecimals(
                  BigInt(position.assetValue),
                  decimals
                ),
              });
            } catch (error) {
              console.error("Failed to refresh vault position:", error);
            }
          };
          refreshPosition();
        }
      }, 2000);
    } catch (error: any) {
      setStatus(`Withdrawal failed: ${error}`);
      console.error("Withdrawal error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Vault Operations</h2>

      {account && (
        <div>
          <p>Connected: {formatAddress(account.address || account)}</p>
          {selectedVault && userPosition && (
            <div>
              <h3>Your Position:</h3>
              <p>Shares: {userPosition.sharesBalance}</p>
              <p>Asset Value: {userPosition.assetValue}</p>
              {userPosition.sharesBalance !== "0" && (
                <p>
                  <strong>
                    {userPosition.sharesBalance} shares (≈{" "}
                    {userPosition.assetValue} assets)
                  </strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div>
        <label>
          Select Vault:
          <select
            value={selectedVault}
            onChange={(e) => setSelectedVault(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select a vault --</option>
            {vaults.map((vault) => (
              <option key={vault.address} value={vault.address}>
                {vault.displayName ||
                  vault.name ||
                  formatAddress(vault.address)}
                {vault.apr && ` (APR: ${vault.apr}%)`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Amount:
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={loading}
          />
        </label>
      </div>

      <div>
        <button onClick={handleDeposit} disabled={loading || !account}>
          Deposit
        </button>
        <button onClick={handleWithdraw} disabled={loading || !account}>
          Withdraw
        </button>
      </div>

      {status && (
        <div>
          <p>Status: {status}</p>
        </div>
      )}
    </div>
  );
}
