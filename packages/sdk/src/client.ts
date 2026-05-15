import type { Aptos } from "@aptos-labs/ts-sdk";
import { CanopyError, CanopyErrorCode, extractMoveAbortDetails } from "@canopyhub/canopy-sdk-core";
import { RewardsDiscoveryClient } from "./data";
import type { CanopyProtocolClient } from "./canopy";
import { CanopyProtocolClient as CanopyProtocolClientImpl } from "./canopy";
import {
  createSdkContext,
  requireCanopyFeatureContext,
  requireMeridianFeatureContext,
  requireRewardsFeatureContext,
} from "./context";
import { RewardsClient } from "./rewards";
import type {
  CanopySdkOptions,
  SdkChainName,
  SimulateTransactionInput,
  SignAndSubmitTransactionInput,
  SignSubmitAndWaitTransactionInput,
  SubmittedAndWaitedTransactionResult,
  SubmittedTransactionResult,
  TransactionSimulationResult,
} from "./types";
import { MeridianClient } from "./alm/meridian";

export class CanopySdk<Chain extends SdkChainName = SdkChainName> {
  readonly alm: {
    meridian?: MeridianClient;
  };
  readonly canopy?: CanopyProtocolClient;
  readonly chain: Chain;
  readonly data: {
    rewardsDiscovery?: RewardsDiscoveryClient;
  };
  readonly rewards?: RewardsClient;
  private readonly client: Aptos;

  constructor(client: Aptos, options: CanopySdkOptions<Chain>) {
    this.client = client;
    const baseContext = createSdkContext(
      client,
      options.chain,
      options.moveposition ? { moveposition: options.moveposition } : undefined
    );
    this.chain = baseContext.chain;

    this.alm = {};
    const rewardsDiscovery =
      baseContext.deployment.features.rewards || options.offchain?.sentioEndpoint
        ? new RewardsDiscoveryClient({
            chain: baseContext.chain,
            ...(options.offchain?.sentioEndpoint
              ? { endpoint: options.offchain.sentioEndpoint }
              : {}),
            ...(options.offchain?.sentioApiKey ? { apiKey: options.offchain.sentioApiKey } : {}),
            ...(options.offchain?.cacheMaxEntries !== undefined
              ? { cacheMaxEntries: options.offchain.cacheMaxEntries }
              : {}),
            ...(options.offchain?.cacheTimeoutMs !== undefined
              ? { cacheTimeoutMs: options.offchain.cacheTimeoutMs }
              : {}),
          })
        : undefined;
    this.data = {
      ...(rewardsDiscovery ? { rewardsDiscovery } : {}),
    };

    if (baseContext.deployment.features.canopy) {
      this.canopy = CanopyProtocolClientImpl.fromContext(
        requireCanopyFeatureContext(baseContext)
      );
    }

    if (baseContext.deployment.features.rewards) {
      this.rewards = RewardsClient.fromContext(
        requireRewardsFeatureContext(baseContext),
        this.data.rewardsDiscovery
      );
    }

    if (baseContext.deployment.features.almMeridian) {
      this.alm.meridian = MeridianClient.fromContext(
        requireMeridianFeatureContext(baseContext)
      );
    }
  }

  async simulateTransaction(
    input: SimulateTransactionInput
  ): Promise<TransactionSimulationResult> {
    const transaction = await this.buildSimpleTransaction({
      sender: input.sender,
      payload: input.payload,
      transactionOptions: input.transactionOptions,
    });

    try {
      const [response] = await this.client.transaction.simulate.simple({
        transaction,
        ...(input.signerPublicKey ? { signerPublicKey: input.signerPublicKey } : {}),
        ...(input.simulationOptions ? { options: input.simulationOptions } : {}),
      });

      if (!response) {
        throw new CanopyError(
          "Transaction simulation returned no result",
          CanopyErrorCode.TransactionBuildFailed,
          { function: input.payload.function }
        );
      }

      if (!response.success) {
        throwTransactionFailure(response.vm_status, input.payload.function);
      }

      return response;
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }

      const moveAbort = extractMoveAbortDetails(error, input.payload.function);
      if (moveAbort) {
        throw new CanopyError(
          "Move abort",
          CanopyErrorCode.MoveAbort,
          { function: input.payload.function, moveAbort },
          { cause: error }
        );
      }

      throw new CanopyError(
        "Transaction simulation failed",
        CanopyErrorCode.TransactionBuildFailed,
        { function: input.payload.function },
        { cause: error }
      );
    }
  }

  async signAndSubmitTransaction(
    input: SignAndSubmitTransactionInput
  ): Promise<SubmittedTransactionResult> {
    const sender = input.sender ?? input.signer.accountAddress;
    const transaction = await this.buildSimpleTransaction({
      sender,
      payload: input.payload,
      transactionOptions: input.transactionOptions,
    });

    try {
      return await this.client.signAndSubmitTransaction({
        signer: input.signer,
        transaction,
      });
    } catch (error) {
      throw wrapTransactionError(
        error,
        input.payload.function,
        "Transaction submission failed"
      );
    }
  }

  async signSubmitAndWaitForTransaction(
    input: SignSubmitAndWaitTransactionInput
  ): Promise<SubmittedAndWaitedTransactionResult> {
    const pending = await this.signAndSubmitTransaction(input);

    try {
      return await this.client.waitForTransaction({
        transactionHash: pending.hash,
        checkSuccess: true,
        ...(input.waitOptions ?? {}),
      });
    } catch (error) {
      throw wrapTransactionError(
        error,
        input.payload.function,
        "Transaction execution failed"
      );
    }
  }

  private buildSimpleTransaction(input: {
    sender: SimulateTransactionInput["sender"];
    payload: SimulateTransactionInput["payload"];
    transactionOptions?: SimulateTransactionInput["transactionOptions"];
  }) {
    return this.client.transaction.build.simple({
      sender: input.sender,
      data: input.payload,
      ...(input.transactionOptions ? { options: input.transactionOptions } : {}),
    });
  }
}

export function createCanopySdk<Chain extends SdkChainName>(
  client: Aptos,
  options: CanopySdkOptions<Chain>
): CanopySdk<Chain> {
  return new CanopySdk(client, options);
}

function throwTransactionFailure(vmStatus: string, fallbackFunction: string): never {
  const moveAbort = extractMoveAbortDetails({ message: vmStatus }, fallbackFunction);

  if (moveAbort) {
    throw new CanopyError("Move abort", CanopyErrorCode.MoveAbort, {
      function: fallbackFunction,
      moveAbort,
      vmStatus,
    });
  }

  throw new CanopyError("Transaction simulation failed", CanopyErrorCode.TransactionBuildFailed, {
    function: fallbackFunction,
    vmStatus,
  });
}

function wrapTransactionError(
  error: unknown,
  fallbackFunction: string,
  message: string
): CanopyError {
  const moveAbort = extractMoveAbortDetails(error, fallbackFunction);

  if (moveAbort) {
    return new CanopyError(
      "Move abort",
      CanopyErrorCode.MoveAbort,
      { function: fallbackFunction, moveAbort },
      { cause: error }
    );
  }

  return new CanopyError(
    message,
    CanopyErrorCode.TransactionBuildFailed,
    { function: fallbackFunction },
    { cause: error }
  );
}
