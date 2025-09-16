import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { WalletConnector } from "./WalletConnector";
import VaultOperations from "./VaultOperations";
import StakingOperations from "./StakingOperations";
import { CanopyClient } from "@canopyhub/canopy-sdk";

export default function App() {
  const aptos = new Aptos(
    new AptosConfig({
      network: Network.CUSTOM,
      fullnode: "https://mainnet.movementnetwork.xyz/v1",
    })
  );

  // @ts-expect-error
  const canopyClient = new CanopyClient(aptos, {
    sentioApiKey: import.meta.env.VITE_SENTIO_API_KEY,
  });

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
      <div style={{ padding: "20px" }}>
        <h1>Canopy SDK Example</h1>
        <WalletConnector />
        <hr />
        <VaultOperations canopyClient={canopyClient} />
        <hr />
        <StakingOperations canopyClient={canopyClient} />
      </div>
    </AptosWalletAdapterProvider>
  );
}
