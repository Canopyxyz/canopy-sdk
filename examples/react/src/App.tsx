import { useMemo, useState, useEffect } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { CanopySdk, type CanopyVaultView, type MeridianVaultSummary } from "@canopyhub/canopy-sdk";
import { getDeployment } from "@canopyhub/canopy-sdk/deployments";
import { WalletConnector } from "./WalletConnector";
import VaultCard from "./VaultCard";
import AlmVaultCard from "./AlmVaultCard";

const CHAIN = "movement-mainnet";
const FULLNODE = "https://mainnet.movementnetwork.xyz/v1";

function buildStrategyNameMap(): Record<string, string> {
  const deployment = getDeployment(CHAIN);
  const strategies = deployment.canopy?.strategies ?? {};
  const nameMap: Record<string, string> = {};
  for (const [name, address] of Object.entries(strategies)) {
    nameMap[address] = name
      .replace("Simple", "")
      .replace("Rewards", "")
      .toLowerCase();
  }
  return nameMap;
}

const STRATEGY_NAMES = buildStrategyNameMap();

const HIDDEN_VAULTS = new Set([
  "0xd686eeb2bc110e74fe6e62e66b1247fedc4a909f4ca8188a640aa7b5098bcb42",
]);

function AlmVaultList({ sdk, aptosClient }: { sdk: CanopySdk; aptosClient: Aptos }) {
  const [vaults, setVaults] = useState<MeridianVaultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const meridian = sdk.alm.meridian;
    if (!meridian) {
      setLoading(false);
      return;
    }

    meridian
      .listVaults({ limit: 50, offset: 0 })
      .then((addresses) => Promise.all(addresses.map((a) => meridian.getVaultSummary(a))))
      .then(setVaults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sdk]);

  if (loading) return <p>Loading ALM vaults...</p>;
  if (!vaults.length) return <p>No ALM vaults found.</p>;

  return (
    <div>
      {vaults.map((vault) => (
        <AlmVaultCard
          key={vault.vaultAddress}
          sdk={sdk}
          aptosClient={aptosClient}
          vault={vault}
        />
      ))}
    </div>
  );
}

function VaultList({ sdk, aptosClient }: { sdk: CanopySdk; aptosClient: Aptos }) {
  const [vaults, setVaults] = useState<CanopyVaultView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sdk.canopy
      ?.listVaults({ limit: 50, offset: 0 })
      .then((page) => setVaults(page.vaults.filter((v) => !HIDDEN_VAULTS.has(v.vaultAddress))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sdk]);

  if (loading) return <p>Loading vaults...</p>;
  if (!vaults.length) return <p>No vaults found.</p>;

  return (
    <div>
      {vaults.map((vault) => (
        <VaultCard
          key={vault.vaultAddress}
          sdk={sdk}
          aptosClient={aptosClient}
          vault={vault}
          strategyNames={STRATEGY_NAMES}
        />
      ))}
    </div>
  );
}

type Page = "canopy" | "alm";

export default function App() {
  const [page, setPage] = useState<Page>("canopy");

  const aptosClient = useMemo(
    () =>
      new Aptos(
        new AptosConfig({
          network: Network.CUSTOM,
          fullnode: FULLNODE,
        })
      ),
    []
  );

  const sdk = useMemo(
    () =>
      new CanopySdk(aptosClient, {
        chain: CHAIN,
        offchain: { sentioApiKey: import.meta.env.VITE_SENTIO_API_KEY },
      }),
    [aptosClient]
  );

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.MAINNET,
        mizuwallet: {
          manifestURL:
            "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      <div style={{ padding: "20px", maxWidth: "960px", margin: "0 auto" }}>
        <h1>Canopy SDK Example</h1>
        <p style={{ fontSize: "0.85em", color: "#888", marginTop: "-12px" }}>
          Network: <strong>{CHAIN}</strong> · {FULLNODE}
        </p>
        <WalletConnector />
        <hr style={{ margin: "24px 0" }} />
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button
            onClick={() => setPage("canopy")}
            style={{ fontWeight: page === "canopy" ? "bold" : "normal" }}
          >
            Canopy Vaults
          </button>
          <button
            onClick={() => setPage("alm")}
            style={{ fontWeight: page === "alm" ? "bold" : "normal" }}
          >
            ALM Vaults
          </button>
        </div>
        {page === "canopy" && <VaultList sdk={sdk} aptosClient={aptosClient} />}
        {page === "alm" && <AlmVaultList sdk={sdk} aptosClient={aptosClient} />}
      </div>
    </AptosWalletAdapterProvider>
  );
}
