import { jest } from "@jest/globals";
import { CanopyError, normalizeMoveAddress } from "../packages/core/src";
import { movementTestnetAbis } from "../packages/bindings/src";
import { CanopySdk, findRedemptionRequest } from "../packages/sdk/src";
import { requireCuratorFeatureContext } from "../packages/sdk/src/context";

const VAULT_PACKAGE = "0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f";
const ROUTER_PACKAGE = "0x4f65dd9785f2ffb51818432646b0994ab43b8a9b602a52f989362883eae7dc17";
const FLOATING_VAULT = "0x33f75e96e66653727e43e4140f9acd4d68ee1f688e2bb15da04ead264916ef91";
const DEPOSITOR = "0x5bacc47db1706e1318b33d78c576397aa77124b282a505964c44f1fec6b93023";
const QUEUE = "0x7aa5d8e31e6136b5a2b9c77a1cbccc0dcf3bda88559c8ac32a33160b8770443f";
const REQUEST = "0xa38a31e2ea362d976f53141c247f3aa297d61ee1ca8520e4fd38d606832ae17b";

interface MockViewClient {
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
}

function createMovementMock(
  responses: Record<string, unknown[] | ((args: unknown[]) => unknown[])>
): MockViewClient {
  return {
    view: jest.fn(async (input: unknown) => {
      const payload = (input as { payload: { function: string; functionArguments?: unknown[] } })
        .payload;
      const response = responses[payload.function];

      if (!response) {
        throw new Error(`Missing mock response for ${payload.function}`);
      }

      return typeof response === "function"
        ? response(payload.functionArguments ?? [])
        : response;
    }),
  };
}

function createCuratorSdk(
  responses: Record<string, unknown[] | ((args: unknown[]) => unknown[])> = {}
) {
  const client = createMovementMock(responses);
  const sdk = new CanopySdk(client as never, { chain: "movement-testnet" });
  return { client, sdk };
}

const VELOCITY_USAGE = { day: "1", month: "17097005004", week: "17097005004" };

// The mandatory (system tier-0) and per-vault checks genuinely differ on the live
// vault: tier-0 has no aggregate caps configured, the vault does. Kept distinct so
// the fixture stays a faithful capture.
const MANDATORY_VELOCITY_CHECK = {
  aggregate_day_headroom: { vec: [] },
  aggregate_month_headroom: { vec: [] },
  aggregate_week_headroom: { vec: [] },
  passes: true,
  wallet_day_headroom: { vec: ["9999999999"] },
  wallet_month_headroom: { vec: ["989999999999"] },
  wallet_week_headroom: { vec: ["89999999999"] },
};
const VAULT_VELOCITY_CHECK = {
  aggregate_day_headroom: { vec: ["499999999999"] },
  aggregate_month_headroom: { vec: ["9982902994996"] },
  aggregate_week_headroom: { vec: ["2482902994996"] },
  passes: true,
  wallet_day_headroom: { vec: ["49999999999"] },
  wallet_month_headroom: { vec: ["989999999999"] },
  wallet_week_headroom: { vec: ["239999999999"] },
};

/**
 * Captured verbatim from a live `POST /v1/view` against movement-testnet, so the
 * decoders are exercised against real serialization: Move enums arrive as
 * `{ __variant__ }` and `Option` as `{ vec: [...] }`.
 */
const LIVE_DEPOSIT_PREVIEW = {
  adapter_cap_headroom: { vec: ["998899999999"] },
  aggregate_usage_after: VELOCITY_USAGE,
  blocking_reasons: [
    {
      raw_abort: {
        error_code: "101",
        module_name: "vault",
        package_address: VAULT_PACKAGE,
      },
      reason_id: { __variant__: "DepositBelowMinimum" },
    },
    {
      raw_abort: {
        error_code: "74",
        module_name: "vault",
        package_address: VAULT_PACKAGE,
      },
      reason_id: { __variant__: "IdleBreachActive" },
    },
  ],
  can_deposit: false,
  deposit_cap_headroom: { vec: ["982902994996"] },
  is_nav_fresh: true,
  is_sanctioned: false,
  is_vault_blocklisted: false,
  mandatory_velocity_check: MANDATORY_VELOCITY_CHECK,
  share_price_e18: "999913459465872909",
  shares_out: "1",
  vault_velocity_check: VAULT_VELOCITY_CHECK,
  wallet_usage_after: { day: "1", month: "10000000001", week: "10000000001" },
};

const VALID_VAULT_CONFIG = {
  adapter_cap: { vec: [] },
  allocator_sla_seconds: "3600",
  auto_allocate_on_deposit: true,
  deposit_cap: { vec: ["1000000000000"] },
  deposits_paused_until: { vec: [] },
  frictionless_threshold: "100000000",
  instant_redeem_fee_bps: "10",
  lock_duration: "86400",
  management_fee_bps: "50",
  max_idle_in_strategy_amount: "500000000",
  max_idle_in_strategy_duration: "7200",
  max_pending_locked_assets: { vec: ["900000000"] },
  min_deposit_amount: "1000000",
  nav_deviation_threshold_bps: "100",
  partner_attribution_enabled: true,
  performance_fee_bps: "1000",
  pricing_policy: { __variant__: "Floating" },
  redemptions_paused_until: { vec: ["1784800000"] },
  request_expiry_window: "604800",
  stale_nav_action: { __variant__: "BlockDeposits" },
  underlying_metadata: { inner: "0xabc" },
  withdrawal_delay_seconds: "172800",
};

/** Also captured live. */
const LIVE_VAULT_ACCOUNTING = {
  effective_assets: "17097005003",
  has_pending_offchain_nav_override: false,
  is_nav_fresh: true,
  last_nav_update_at: "1784721120",
  locked_profit: "0",
  reported_offchain_nav: "0",
  reserved_for_queue: "0",
  share_price_e18: "999930373646690639",
  share_total_supply: "17098195488",
  strategy_idle_assets: "1100000000",
  total_assets: "17097005003",
  unreserved_buffer: "15997005003",
};

describe("curator client composition", () => {
  it("constructs only the curator client on movement-testnet", () => {
    const { sdk } = createCuratorSdk();

    expect(sdk.curator).toBeDefined();
    expect(sdk.canopy).toBeUndefined();
    expect(sdk.rewards).toBeUndefined();
    expect(sdk.alm.meridian).toBeUndefined();
  });

  it("does not construct a curator client on chains without the deployment", () => {
    const { sdk } = createCuratorSdk();
    const mainnet = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-mainnet",
    });

    expect(sdk.curator).toBeDefined();
    expect(mainnet.curator).toBeUndefined();
  });
});

describe("requireCuratorFeatureContext", () => {
  const CURATOR_ABI_KEYS = [
    "curatorRouter",
    "curatorVault",
    "curatorQueue",
    "curatorPartnerRegistry",
  ] as const;

  function baseContext() {
    return {
      abis: Object.fromEntries(CURATOR_ABI_KEYS.map((key) => [key, { name: key }])),
      chain: "movement-testnet",
      client: createMovementMock({}),
      deployment: { features: { canopy: false, curator: true, rewards: false, almMeridian: false } },
    };
  }

  it("accepts a context carrying all four curator ABIs", () => {
    expect(() => requireCuratorFeatureContext(baseContext() as never)).not.toThrow();
  });

  it.each(CURATOR_ABI_KEYS)("rejects a context missing %s", (missingKey) => {
    // The client reads queue::request_detail and partner_registry::is_registered,
    // so gating on router+vault alone would let it construct and fail later.
    const context = baseContext();
    delete (context.abis as Record<string, unknown>)[missingKey];

    expect(() => requireCuratorFeatureContext(context as never)).toThrow(
      "SDK context does not satisfy the requested feature requirements"
    );
  });

  it("rejects a context whose curator feature flag is off", () => {
    const context = baseContext();
    context.deployment.features.curator = false;

    expect(() => requireCuratorFeatureContext(context as never)).toThrow();
  });

  it("reports the curator feature name in the error details", () => {
    const context = baseContext();
    context.deployment.features.curator = false;

    try {
      requireCuratorFeatureContext(context as never);
      throw new Error("expected a throw");
    } catch (error) {
      expect((error as { details?: { feature?: string } }).details?.feature).toBe("curator");
    }
  });
});

describe("curator entry payloads", () => {
  it("carries no abi field so ts-sdk strips the leading &signer itself", () => {
    // Surf's createEntryPayload attaches an `abi` whose `parameters` still include
    // `&signer`, which makes transaction.build.simple reject argument 0 with
    // "Type mismatch for argument 0, type '&signer'". Verified against
    // movement-testnet: plain payloads build, Surf payloads do not.
    const { sdk } = createCuratorSdk();
    const payload = sdk.curator!.buildDepositPayload({
      vaultAddress: FLOATING_VAULT,
      amount: 1n,
    });

    expect(Object.keys(payload).sort()).toEqual([
      "function",
      "functionArguments",
      "typeArguments",
    ]);
    expect(payload).not.toHaveProperty("abi");
  });

  it("only targets entry functions that exist in the checked-in router ABI", () => {
    // Replaces the compile-time guarantee Surf would have given: every function the
    // client can build must be a real entry function on the bound ABI. `abi:check`
    // covers drift between that ABI and the chain.
    const entryFunctions = new Set(
      movementTestnetAbis.curatorRouter.exposed_functions
        .filter((fn) => fn.is_entry)
        .map((fn) => fn.name)
    );
    const { sdk } = createCuratorSdk();
    const built = [
      sdk.curator!.buildDepositPayload({ vaultAddress: FLOATING_VAULT, amount: 1n }),
      sdk.curator!.buildDepositWithPartnerPayload({
        vaultAddress: FLOATING_VAULT,
        amount: 1n,
        partnerId: 1n,
      }),
      sdk.curator!.buildInstantRedeemPayload({ vaultAddress: FLOATING_VAULT, shares: 1n }),
      sdk.curator!.buildRequestRedemptionPayload({
        vaultAddress: FLOATING_VAULT,
        shares: 1n,
      }),
      sdk.curator!.buildClaimRedemptionPayload({
        vaultAddress: FLOATING_VAULT,
        requestAddress: REQUEST,
      }),
      sdk.curator!.buildCancelRedemptionPayload({
        vaultAddress: FLOATING_VAULT,
        requestAddress: REQUEST,
      }),
      sdk.curator!.buildClaimbackEscrowedSharesPayload({
        vaultAddress: FLOATING_VAULT,
        requestAddress: REQUEST,
      }),
    ];

    for (const payload of built) {
      const [address, moduleName, functionName] = payload.function.split("::");
      expect(address).toBe(ROUTER_PACKAGE);
      expect(moduleName).toBe("router");
      expect(entryFunctions).toContain(functionName);
    }
  });

  it("matches each built payload's argument count to the ABI, minus the signer", () => {
    const abiFunctions = new Map(
      movementTestnetAbis.curatorRouter.exposed_functions.map((fn) => [fn.name, fn])
    );
    const { sdk } = createCuratorSdk();
    const cases = [
      sdk.curator!.buildDepositPayload({ vaultAddress: FLOATING_VAULT, amount: 1n }),
      sdk.curator!.buildDepositWithPartnerPayload({
        vaultAddress: FLOATING_VAULT,
        amount: 1n,
        partnerId: 1n,
      }),
      sdk.curator!.buildInstantRedeemPayload({ vaultAddress: FLOATING_VAULT, shares: 1n }),
      sdk.curator!.buildClaimRedemptionPayload({
        vaultAddress: FLOATING_VAULT,
        requestAddress: REQUEST,
      }),
    ];

    for (const payload of cases) {
      const functionName = payload.function.split("::")[2] as string;
      const abiFunction = abiFunctions.get(functionName);
      expect(abiFunction).toBeDefined();
      // params[0] is `&signer`, supplied by the sender rather than the payload.
      expect(abiFunction?.params[0]).toBe("&signer");
      expect(payload.functionArguments).toHaveLength(abiFunction!.params.length - 1);
    }
  });

  it("builds a deposit payload with the trailing unused data argument as none", () => {
    const { sdk } = createCuratorSdk();
    const payload = sdk.curator!.buildDepositPayload({
      vaultAddress: FLOATING_VAULT,
      amount: 5_000_000n,
      minSharesOut: 4_900_000n,
    });

    expect(payload.function).toBe(`${ROUTER_PACKAGE}::router::deposit`);
    expect(payload.typeArguments).toEqual([]);
    expect(payload.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      "5000000",
      "4900000",
      undefined,
    ]);
  });

  it("omits minSharesOut as none rather than zero", () => {
    const { sdk } = createCuratorSdk();
    const payload = sdk.curator!.buildDepositPayload({
      vaultAddress: FLOATING_VAULT,
      amount: 5_000_000n,
    });

    expect(payload.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      "5000000",
      undefined,
      undefined,
    ]);
  });

  it("places partner_id after min_shares_out, not next to the amount", () => {
    // router.move orders this `vault, usdc_amount, min_shares_out, partner_id, data`.
    // The SDK input object is alphabetical, so a naive implementation swaps these two.
    const { sdk } = createCuratorSdk();
    const payload = sdk.curator!.buildDepositWithPartnerPayload({
      vaultAddress: FLOATING_VAULT,
      amount: 5_000_000n,
      minSharesOut: 4_900_000n,
      partnerId: 7n,
    });

    expect(payload.function).toBe(`${ROUTER_PACKAGE}::router::deposit_with_partner`);
    expect(payload.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      "5000000",
      "4900000",
      "7",
      undefined,
    ]);
  });

  it("emits no data argument for redemption entry functions", () => {
    // `data: Option<vector<u8>>` exists only on the two deposit functions.
    const { sdk } = createCuratorSdk();

    const instant = sdk.curator!.buildInstantRedeemPayload({
      vaultAddress: FLOATING_VAULT,
      shares: 1_000_000n,
      minAssetsOut: 990_000n,
    });
    expect(instant.function).toBe(`${ROUTER_PACKAGE}::router::instant_redeem`);
    expect(instant.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      "1000000",
      "990000",
    ]);

    const queued = sdk.curator!.buildRequestRedemptionPayload({
      vaultAddress: FLOATING_VAULT,
      shares: 1_000_000n,
    });
    expect(queued.function).toBe(`${ROUTER_PACKAGE}::router::request_redemption`);
    expect(queued.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      "1000000",
      undefined,
    ]);
  });

  it("builds the three request lifecycle payloads from vault and request addresses", () => {
    const { sdk } = createCuratorSdk();
    const input = { vaultAddress: FLOATING_VAULT, requestAddress: REQUEST };
    const expectedArguments = [
      normalizeMoveAddress(FLOATING_VAULT),
      normalizeMoveAddress(REQUEST),
    ];

    expect(sdk.curator!.buildClaimRedemptionPayload(input)).toMatchObject({
      function: `${ROUTER_PACKAGE}::router::claim_redemption`,
      functionArguments: expectedArguments,
    });
    expect(sdk.curator!.buildCancelRedemptionPayload(input)).toMatchObject({
      function: `${ROUTER_PACKAGE}::router::cancel_redemption`,
      functionArguments: expectedArguments,
    });
    expect(sdk.curator!.buildClaimbackEscrowedSharesPayload(input)).toMatchObject({
      function: `${ROUTER_PACKAGE}::router::claimback_escrowed_shares`,
      functionArguments: expectedArguments,
    });
  });
});

describe("curator reads", () => {
  it("decodes the live vault_accounting snapshot", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vault_accounting`]: [LIVE_VAULT_ACCOUNTING],
    });

    await expect(sdk.curator!.getVaultAccounting(FLOATING_VAULT)).resolves.toEqual({
      effectiveAssets: 17097005003n,
      hasPendingOffchainNavOverride: false,
      isNavFresh: true,
      lastNavUpdateAt: 1784721120n,
      lockedProfit: 0n,
      reportedOffchainNav: 0n,
      reservedForQueue: 0n,
      sharePriceE18: 999930373646690639n,
      shareTotalSupply: 17098195488n,
      strategyIdleAssets: 1100000000n,
      totalAssets: 17097005003n,
      unreservedBuffer: 15997005003n,
    });
  });

  it("decodes live deposit_preview blocking reasons including enum variants", async () => {
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::deposit_preview`]: [LIVE_DEPOSIT_PREVIEW],
    });

    const preview = await sdk.curator!.previewDeposit({
      vaultAddress: FLOATING_VAULT,
      depositor: DEPOSITOR,
      amount: 1n,
    });

    expect(preview.canDeposit).toBe(false);
    expect(preview.blockingReasons).toEqual([
      {
        reasonId: "DepositBelowMinimum",
        rawAbort: { errorCode: 101n, moduleName: "vault", packageAddress: VAULT_PACKAGE },
      },
      {
        reasonId: "IdleBreachActive",
        rawAbort: { errorCode: 74n, moduleName: "vault", packageAddress: VAULT_PACKAGE },
      },
    ]);
    expect(preview.sharesOut).toBe(1n);
    expect(preview.depositCapHeadroom).toBe(982902994996n);
    // `{ vec: [] }` must decode to null, never 0 — "uncapped" is not "zero headroom".
    expect(preview.mandatoryVelocityCheck.aggregateDayHeadroom).toBeNull();
    expect(preview.mandatoryVelocityCheck.aggregateMonthHeadroom).toBeNull();
    expect(preview.mandatoryVelocityCheck.walletDayHeadroom).toBe(9999999999n);
    expect(preview.vaultVelocityCheck.aggregateDayHeadroom).toBe(499999999999n);

    // An absent Option view argument is `undefined`. The ts-sdk converts arguments
    // against the module ABI, so a `{ vec: [] }` envelope is rejected with
    // "Type mismatch for argument 3" — verified against the live fullnode.
    const payload = (client.view.mock.calls[0]?.[0] as {
      payload: { functionArguments: unknown[] };
    }).payload;
    expect(payload.functionArguments[3]).toBeUndefined();
  });

  it("passes a present Option view argument as a bare scalar", async () => {
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::deposit_preview`]: [LIVE_DEPOSIT_PREVIEW],
    });

    await sdk.curator!.previewDeposit({
      vaultAddress: FLOATING_VAULT,
      depositor: DEPOSITOR,
      amount: 5_000_000n,
      minSharesOut: 4_900_000n,
    });

    const payload = (client.view.mock.calls[0]?.[0] as {
      payload: { functionArguments: unknown[] };
    }).payload;
    expect(payload.functionArguments[3]).toBe("4900000");
  });

  it("decodes vault_config_view enums and optional caps", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vault_config_view`]: [VALID_VAULT_CONFIG],
    });

    const config = await sdk.curator!.getVaultConfig(FLOATING_VAULT);

    expect(config.pricingPolicy).toBe("Floating");
    expect(config.staleNavAction).toBe("BlockDeposits");
    expect(config.adapterCap).toBeNull();
    expect(config.depositCap).toBe(1000000000000n);
    expect(config.depositsPausedUntil).toBeNull();
    expect(config.redemptionsPausedUntil).toBe(1784800000n);
    expect(config.partnerAttributionEnabled).toBe(true);
    expect(config.underlyingMetadata).toBe(normalizeMoveAddress("0xabc"));
  });

  it("keeps absent wallet velocity usage null rather than zero", async () => {
    // `none` means the wallet has no recorded activity at all, which is a different
    // statement from zero usage in the current windows.
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::user_position_view`]: [
        {
          deposit_wallet_usage: { vec: [] },
          is_sanctioned: false,
          is_vault_blocklisted: false,
          open_request_count: "2",
          redemption_wallet_usage: { vec: [VELOCITY_USAGE] },
          share_balance: "17098195488",
          share_price_e18: "999930373646690639",
          share_value: "17097005003",
        },
      ],
    });

    const position = await sdk.curator!.getUserVaultPosition({
      userAddress: DEPOSITOR,
      vaultAddress: FLOATING_VAULT,
    });

    expect(position.depositWalletUsage).toBeNull();
    expect(position.redemptionWalletUsage).toEqual({
      day: 1n,
      month: 17097005004n,
      week: 17097005004n,
    });
    expect(position.openRequestCount).toBe(2n);
    expect(position.userAddress).toBe(normalizeMoveAddress(DEPOSITOR));
    expect(position.vaultAddress).toBe(normalizeMoveAddress(FLOATING_VAULT));
  });

  it("pages the vault registry", async () => {
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vaults`]: (args: unknown[]) =>
        args[0] === "0" ? [[FLOATING_VAULT]] : [[]],
    });

    await expect(sdk.curator!.listVaults({ offset: 0, limit: 10 })).resolves.toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
    ]);
    // An offset past the end returns empty rather than aborting, so callers page
    // until empty.
    await expect(sdk.curator!.listVaults({ offset: 99, limit: 10 })).resolves.toEqual([]);
    expect(client.view).toHaveBeenCalledTimes(2);
  });

  it("resolves the queue object before reading per-user request state", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::queue_object`]: [{ inner: QUEUE }],
      [`${VAULT_PACKAGE}::queue::open_request_count`]: ["3"],
    });

    await expect(
      sdk.curator!.getOpenRequestCount({
        ownerAddress: DEPOSITOR,
        vaultAddress: FLOATING_VAULT,
      })
    ).resolves.toBe(3n);
  });

  it("returns request status so claimback-pending entries can be filtered out", async () => {
    // `user_request_addresses` is not a work queue: it also returns Cancelled /
    // Denied / Expired requests whose escrow is unreclaimed, and those abort if
    // passed to claim or cancel.
    const cancelled = "0x7197e95ea0c520cda2b32b9e27fbc44e9b3bc8434d48f4f3eaa3b7900232b4c5";
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::queue_object`]: [{ inner: QUEUE }],
      [`${VAULT_PACKAGE}::queue::user_request_addresses`]: [[REQUEST, cancelled]],
      [`${VAULT_PACKAGE}::queue::request_detail`]: (args: unknown[]) => {
        const isCancelled = args[0] === normalizeMoveAddress(cancelled);

        return [
          {
            claimable_at: "1784800000",
            claimed_amount: "0",
            escrowed_shares: "1000000",
            expires_at: "1785400000",
            frozen_at: { vec: [] },
            funded_amount: "0",
            funded_at: { vec: [] },
            locked_assets_out: isCancelled ? { vec: [] } : { vec: ["999000"] },
            original_escrowed_shares: "1000000",
            owner: DEPOSITOR,
            pending_recovery_address: { vec: [] },
            pending_recovery_not_before: { vec: [] },
            status: { __variant__: isCancelled ? "Cancelled" : "Pending" },
            submitted_at: "1784700000",
          },
        ];
      },
    });

    const requests = await sdk.curator!.getUserRedemptionRequests({
      ownerAddress: DEPOSITOR,
      vaultAddress: FLOATING_VAULT,
    });

    expect(requests.map((request) => request.status)).toEqual(["Pending", "Cancelled"]);
    expect(requests[0]?.requestAddress).toBe(normalizeMoveAddress(REQUEST));
    // fundedAmount is 0 before an allocator funds; lockedAssetsOut carries the
    // LockedIn payout estimate instead.
    expect(requests[0]?.fundedAmount).toBe(0n);
    expect(requests[0]?.lockedAssetsOut).toBe(999000n);
    expect(requests[0]?.submittedAt).toBe(1784700000n);
    expect(requests[1]?.lockedAssetsOut).toBeNull();
  });

  it("returns null for an unregistered partner instead of surfacing the abort", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::partner_registry::is_registered`]: (args: unknown[]) => [
        args[0] === "7",
      ],
      [`${VAULT_PACKAGE}::partner_registry::payout_address`]: [DEPOSITOR],
    });

    await expect(sdk.curator!.isPartnerRegistered(7n)).resolves.toBe(true);
    await expect(sdk.curator!.getPartnerPayoutAddress(7n)).resolves.toBe(
      normalizeMoveAddress(DEPOSITOR)
    );
    await expect(sdk.curator!.isPartnerRegistered(99n)).resolves.toBe(false);
    await expect(sdk.curator!.getPartnerPayoutAddress(99n)).resolves.toBeNull();
  });

  it("fails loudly on malformed view data", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vault_accounting`]: ["not-a-struct"],
      // A bare enum variant string where the fullnode sends `{ __variant__ }`.
      [`${VAULT_PACKAGE}::vault::vault_config_view`]: [
        { ...VALID_VAULT_CONFIG, pricing_policy: "Floating" },
      ],
      [`${VAULT_PACKAGE}::queue::request_detail`]: [
        { ...VALID_VAULT_CONFIG, owner: DEPOSITOR },
      ],
    });

    await expect(sdk.curator!.getVaultAccounting(FLOATING_VAULT)).rejects.toThrow(
      "Expected AccountingSnapshot struct"
    );
    await expect(sdk.curator!.getVaultConfig(FLOATING_VAULT)).rejects.toThrow(
      "Expected Move enum"
    );
    await expect(sdk.curator!.getRedemptionRequest(REQUEST)).rejects.toThrow();
  });
});

describe("findRedemptionRequest", () => {
  const txResult = {
    events: [
      { type: "0x1::fungible_asset::Withdraw", data: { amount: "1000000" } },
      {
        type: `${VAULT_PACKAGE}::vault::RedemptionRequestedEvent`,
        data: {
          vault: FLOATING_VAULT,
          user: DEPOSITOR,
          request_object_address: REQUEST,
          shares_escrowed: "1000000",
          usdc_estimate: "999000",
          claimable_at: "1784800000",
          expires_at: "1785400000",
        },
      },
    ],
  };

  it("recovers the request object address the entry function drops", () => {
    // router::request_redemption discards the Object<RedemptionRequest> it receives,
    // so the event is the only source for the address.
    expect(findRedemptionRequest(txResult)).toEqual({
      claimableAt: 1784800000n,
      expiresAt: 1785400000n,
      requestAddress: normalizeMoveAddress(REQUEST),
      sharesEscrowed: 1000000n,
      usdcEstimate: 999000n,
      userAddress: normalizeMoveAddress(DEPOSITOR),
      vaultAddress: normalizeMoveAddress(FLOATING_VAULT),
    });
  });

  // Once the event type matches, the event is ours and every field is required.
  // Defaulting or skipping both surface as a plausible lie: "escrowed nothing",
  // "claimable since the epoch", or "no request found".
  function eventWith(overrides: Record<string, unknown>) {
    return {
      events: [
        {
          type: `${VAULT_PACKAGE}::vault::RedemptionRequestedEvent`,
          data: {
            vault: FLOATING_VAULT,
            user: DEPOSITOR,
            request_object_address: REQUEST,
            shares_escrowed: "1000000",
            usdc_estimate: "999000",
            claimable_at: "1784800000",
            expires_at: "1785400000",
            ...overrides,
          },
        },
      ],
    };
  }

  it.each([
    ["missing", undefined],
    // BigInt("") and BigInt(" ") are 0n, so a bare BigInt call would fabricate a value.
    ["an empty string", ""],
    ["whitespace", "  "],
    // BigInt("abc") raises a native SyntaxError rather than a CanopyError.
    ["non-numeric text", "abc"],
    ["a negative value", "-1"],
    ["a non-integer", 1.5],
    ["an unsafe integer", Number.MAX_VALUE],
  ])("throws a named CanopyError when a numeric field is %s", (_label, value) => {
    const parse = () => findRedemptionRequest(eventWith({ shares_escrowed: value }));

    expect(parse).toThrow(CanopyError);
    expect(parse).toThrow(/shares_escrowed/);
  });

  it("accepts u64 values that exceed Number.MAX_SAFE_INTEGER as strings", () => {
    const request = findRedemptionRequest(
      eventWith({ shares_escrowed: "18446744073709551615" })
    );

    expect(request?.sharesEscrowed).toBe(18446744073709551615n);
  });

  it.each([
    ["request_object_address", "request_object_address"],
    ["vault", "vault"],
    ["user", "user"],
  ])("throws rather than skipping when the %s address is missing", (_label, field) => {
    const parse = () => findRedemptionRequest(eventWith({ [field]: undefined }));

    expect(parse).toThrow(CanopyError);
    expect(parse).toThrow(new RegExp(field));
  });

  it("throws on an empty address rather than normalizing it to 0x0", () => {
    expect(() => findRedemptionRequest(eventWith({ vault: "" }))).toThrow(/vault/);
  });

  it("filters by vault and user, and tolerates transactions with no request", () => {
    const requestedEvent = txResult.events[1];
    if (!requestedEvent) {
      throw new Error("fixture should include a redemption event");
    }

    const wrongPackage = {
      events: [
        {
          ...requestedEvent,
          type: `${ROUTER_PACKAGE}::vault::RedemptionRequestedEvent`,
        },
      ],
    };

    expect(findRedemptionRequest(txResult, { vaultAddress: FLOATING_VAULT })).toBeDefined();
    expect(findRedemptionRequest(txResult, { userAddress: QUEUE })).toBeUndefined();
    expect(
      findRedemptionRequest(wrongPackage, { packageAddress: VAULT_PACKAGE })
    ).toBeUndefined();
    expect(findRedemptionRequest({ events: [] })).toBeUndefined();
    expect(findRedemptionRequest({})).toBeUndefined();
  });
});
