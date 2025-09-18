import { useClients, useSignAndSubmitTransaction } from "@aptos-labs/react";
import { CanopyClient } from "@canopyhub/canopy-sdk";

export default function App() {
  const { aptos } = useClients();
  const client = new CanopyClient(aptos);

  const {
    mutate: signAndSubmitTransaction,
    data: signedTransaction,
    isPending,
    isSuccess,
  } = useSignAndSubmitTransaction();

  const amount = 100000000n;
  const vaultAddress =
    "0x31d0a30ae53e2ae852fcbdd1fce75a4ea6ad81417739ef96883eba9574ffe31e";

  const handleSignTransaction = async () => {
    const payload = await client.withdraw(vaultAddress, amount);
    signAndSubmitTransaction({ data: payload });
  };

  return (
    <div>
      <button onClick={handleSignTransaction} disabled={isPending}>
        Withdraw
      </button>

      {isPending && <p>Signing transaction...</p>}
      {isSuccess && <p>Transaction authenticator: {signedTransaction?.hash}</p>}
    </div>
  );
}
