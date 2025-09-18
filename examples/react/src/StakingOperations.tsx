import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { scaleToDecimals, scaleFromDecimals, formatAddress } from "./utils";
import type { CanopyClient } from "@canopyhub/canopy-sdk";

export default function StakingOperations({
  canopyClient,
}: {
  canopyClient: CanopyClient;
}) {
  const { account, signAndSubmitTransaction } = useWallet();
  const [vaults, setVaults] = useState<any[]>([]);
  const [selectedVault, setSelectedVault] = useState<string>("");
  const [selectedVaultData, setSelectedVaultData] = useState<any>(null);
  const [stakingToken, setStakingToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [sharesBalance, setSharesBalance] = useState<string>("0");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [earnedRewards, setEarnedRewards] = useState<string>("0");
  const [stakingPosition, setStakingPosition] = useState<any>(null);

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
  }, [canopyClient]);

  // Handle vault selection
  const handleVaultChange = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);

    if (vaultAddress) {
      const vault = vaults.find((v) => v.address === vaultAddress);
      setSelectedVaultData(vault);
      // Use sharesAsset as the shares token (staking token)
      setStakingToken(vault?.sharesAsset || "");
    } else {
      setSelectedVaultData(null);
      setStakingToken("");
    }
  };

  // Fetch vault position for shares balance
  useEffect(() => {
    const fetchVaultPosition = async () => {
      try {
        if (!account || !selectedVault) {
          setSharesBalance("0");
          return;
        }

        const userAddress = account.address?.toString() || account.toString();
        const position = await canopyClient.getUserVaultPosition(
          userAddress,
          selectedVault
        );
        const decimals = selectedVaultData?.sharesAssetDecimals || 8;
        setSharesBalance(
          scaleFromDecimals(BigInt(position.sharesBalance), decimals)
        );
      } catch (error) {
        console.error("Failed to fetch vault position:", error);
        setSharesBalance("0");
      }
    };

    fetchVaultPosition();
  }, [account, selectedVault, selectedVaultData, canopyClient]);

  // Fetch staking data when account and staking token are available
  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        if (!account || !stakingToken) {
          setStakingPosition(null);
          setStakedBalance("0");
          setEarnedRewards("0");
          return;
        }

        const userAddress = account.address?.toString() || account.toString();

        // Get staked balance using dedicated method
        const stakedAmount = await canopyClient.getUserStakedBalance(
          userAddress,
          stakingToken
        );
        setStakedBalance(scaleFromDecimals(BigInt(stakedAmount), 8));

        // Get staking position for rewards
        const position = await canopyClient.getUserStakingPosition(
          userAddress,
          stakingToken
        );
        setStakingPosition(position);

        // Calculate total rewards
        const totalRewards =
          position.pendingRewards?.reduce((acc: bigint, reward: any) => {
            return acc + BigInt(reward.amount || 0);
          }, 0n) || 0n;
        setEarnedRewards(scaleFromDecimals(totalRewards, 8));
      } catch (error) {
        console.error("Failed to fetch staking data:", error);
        setStakingPosition(null);
        setStakedBalance("0");
        setEarnedRewards("0");
      }
    };

    fetchStakingData();
  }, [account, stakingToken, canopyClient]);

  const handleStake = async () => {
    if (!account || !stakingToken || !amount || !canopyClient) {
      setStatus("Please connect wallet, select vault, and enter amount");
      return;
    }

    setLoading(true);
    setStatus("Processing stake...");

    try {
      // Scale amount by decimals (using vault shares decimals)
      const decimals = selectedVaultData?.decimals1 || 8;
      const scaledAmount = scaleToDecimals(amount, decimals);

      // Get user address for subscription checking
      const userAddress = account.address?.toString() || account.toString();

      // Build stake transaction with user address for subscription checking
      const payload = await canopyClient.stake(
        stakingToken,
        scaledAmount,
        userAddress
      );

      // Submit transaction
      const response = await signAndSubmitTransaction({
        // @ts-expect-error
        data: payload,
      });

      setStatus(`Stake successful! TX: ${response.hash}`);
      setAmount("");

      // Refresh staking position after a delay
      setTimeout(() => {
        const event = new Event("storage");
        window.dispatchEvent(event);
      }, 2000);
    } catch (error: any) {
      setStatus(`Stake failed: ${error.message}`);
      console.error("Stake error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!account || !stakingToken || !amount || !canopyClient) {
      setStatus("Please connect wallet, select vault, and enter amount");
      return;
    }

    setLoading(true);
    setStatus("Processing unstake...");

    try {
      // Scale amount by decimals (using vault shares decimals)
      const decimals = selectedVaultData?.decimals1 || 8;
      const scaledAmount = scaleToDecimals(amount, decimals);

      // Build unstake transaction
      const payload = await canopyClient.unstake(stakingToken, scaledAmount);

      // Submit transaction
      const response = await signAndSubmitTransaction({
        // @ts-expect-error
        data: payload,
      });

      setStatus(`Unstake successful! TX: ${response.hash}`);
      setAmount("");

      // Refresh staking position
      setTimeout(() => {
        const event = new Event("storage");
        window.dispatchEvent(event);
      }, 2000);
    } catch (error: any) {
      setStatus(`Unstake failed: ${error.message}`);
      console.error("Unstake error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!account || !stakingToken || !canopyClient) {
      setStatus("Please connect wallet and select vault");
      return;
    }

    setLoading(true);
    setStatus("Claiming rewards...");

    try {
      // Build claim rewards transaction for staking token
      const payload = await canopyClient.claimRewards([stakingToken]);

      // Submit transaction
      const response = await signAndSubmitTransaction({
        // @ts-expect-error
        data: payload,
      });

      setStatus(`Rewards claimed! TX: ${response.hash}`);

      // Refresh staking position
      setTimeout(() => {
        const event = new Event("storage");
        window.dispatchEvent(event);
      }, 2000);
    } catch (error: any) {
      setStatus(`Claim failed: ${error.message}`);
      console.error("Claim error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Vault Shares Staking</h2>

      {account && (
        <div>
          <p>Connected: {formatAddress(account.address || account)}</p>
          {selectedVaultData && (
            <>
              <p>Shares Balance: {sharesBalance} shares</p>
              <p>Staked Balance: {stakedBalance} shares</p>
              <p>Earned Rewards: {earnedRewards}</p>
            </>
          )}
        </div>
      )}

      <div>
        <label>
          Select Vault to Stake Shares:
          <select
            value={selectedVault}
            onChange={(e) => handleVaultChange(e.target.value)}
            disabled={loading}
            style={{ width: "400px", marginLeft: "10px" }}
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

      {selectedVaultData && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
          }}
        >
          <h3>Selected Vault Information:</h3>
          <p>
            <strong>Vault:</strong>{" "}
            {selectedVaultData.displayName || formatAddress(selectedVault)}
          </p>
          <p>
            <strong>Vault Address:</strong> {formatAddress(selectedVault)}
          </p>
          <p>
            <strong>Shares Token:</strong> {formatAddress(stakingToken)}
          </p>
          {selectedVaultData.description && (
            <p>
              <strong>Description:</strong> {selectedVaultData.description}
            </p>
          )}
          {selectedVaultData.apr && (
            <p>
              <strong>APR:</strong> {selectedVaultData.apr}%
            </p>
          )}
          {selectedVaultData.tvl && (
            <p>
              <strong>TVL:</strong> ${selectedVaultData.tvl}
            </p>
          )}
        </div>
      )}

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
        <button
          onClick={handleStake}
          disabled={loading || !account || !selectedVault}
          style={{ marginRight: "10px" }}
        >
          Stake Shares
        </button>
        <button
          onClick={handleUnstake}
          disabled={loading || !account || !selectedVault}
          style={{ marginRight: "10px" }}
        >
          Unstake Shares
        </button>
        <button
          onClick={handleClaimRewards}
          disabled={
            loading ||
            !account ||
            !selectedVault ||
            !earnedRewards ||
            earnedRewards === "0"
          }
        >
          Claim Rewards
        </button>
      </div>

      {status && (
        <div>
          <p>Status: {status}</p>
        </div>
      )}

      {stakingPosition && stakingPosition.pendingRewards?.length > 0 && (
        <div>
          <h3>Pending Rewards Detail:</h3>
          <ul>
            {stakingPosition.pendingRewards.map((reward: any, idx: number) => (
              <li key={idx}>
                Pool: {formatAddress(reward.poolAddress)} - Amount:{" "}
                {scaleFromDecimals(BigInt(reward.amount || 0), 8)}
                Token: {formatAddress(reward.rewardToken)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
