import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { formatAddress } from "./utils";

export function WalletConnector() {
  const { connected, account, connect, disconnect, wallet, wallets } =
    useWallet();

  const handleConnect = async () => {
    if (wallets && wallets.length > 0) {
      // Connect to first available wallet
      try {
        await connect(wallets[0].name);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install a wallet extension (Petra, Pontem, etc.)");
    }
  };

  return (
    <div>
      <h2>Wallet Connection</h2>
      {connected && account ? (
        <div>
          <p>Connected to: {wallet?.name}</p>
          <p>Address: {formatAddress(account.address || account)}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <p>Not connected</p>
          <div>
            {wallets && wallets.length > 0 ? (
              wallets.map((w) => (
                <button key={w.name} onClick={() => connect(w.name)}>
                  Connect {w.name}
                </button>
              ))
            ) : (
              <button onClick={handleConnect}>Connect Wallet</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
