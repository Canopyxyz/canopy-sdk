import { jest } from "@jest/globals";
import { CanopyError, normalizeMoveAddress } from "../packages/core/src";
import { movementTestnetAbis } from "../packages/bindings/src";
import {
  CanopySdk,
  findRedemptionFundingMinimumNotMetEvent,
  findRedemptionFundingMinimumNotMetEvents,
  findRedemptionRequest,
} from "../packages/sdk/src";
import { requireCuratorFeatureContext } from "../packages/sdk/src/context";

// Two forms of the same package, and they are not interchangeable.
//
// The fullnode reports this package unpadded (63 hex); `normalizeMoveAddress` pads it to
// 64. Mock keys are `payload.function`, which `moveFunctionId` normalizes, and decoded
// expectations come back through `readMoveAddress` — both padded. Only fields captured
// verbatim off the wire, such as `raw_abort.package_address`, keep the raw form.
const VAULT_PACKAGE = "0x08e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b";
const VAULT_PACKAGE_RAW = "0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b";
const ROUTER_PACKAGE = "0x313050fa1c20243da4b6fbe94d8e1c59fbba012afdf9a783e3beda67a5552b97";
const FLOATING_VAULT = "0x3c7a6b46594b02139e6411a8dc2f83cb7b4552f6138f46a321fcba1500a0ef8e";
const DEPOSITOR = "0xdc66c438a6579a36f533a6404954d4ec33e595bc8fc2b30f87ef6d792837149b";
const QUEUE = "0x4a2785da7d7915b69ca1d361b1c5a0aa81ac564dc1ff7097e05e625acd5edf9b";
const REQUEST = "0xa38a31e2ea362d976f53141c247f3aa297d61ee1ca8520e4fd38d606832ae17b";

/** Uppercase hex: valid input, not canonical output. `normalizeMoveAddress` lowercases it. */
const denormalized = (address: string) => `0x${address.slice(2).toUpperCase()}`;

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

// Tier-0 (system) and per-vault checks are kept distinct because they genuinely differ
// in shape: tier-0 configures no aggregate caps, a vault does. Values are synthetic —
// see DEPOSIT_PREVIEW below.
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
 * A synthetic `deposit_preview` — the wire *shape* is real (Move enums as
 * `{ __variant__ }`, `Option` as `{ vec: [...] }`), the values are not.
 *
 * It models a populated vault with every optional field present and a specific pair of
 * blocking reasons, including `IdleBreachActive`.
 *
 * Its job is coverage that does not depend on what movement-testnet happens to hold. The
 * live previews in `scripts/ci/check-live-payloads.mjs` are a genuine second signal, but
 * which branches they reach changes as the deployment is configured and used — caps get
 * set, usage accrues, reasons come and go — so which of these fields a live run decodes is
 * not something this comment can usefully pin down. Assume nothing here is redundant.
 *
 * `raw_abort.package_address` is the one genuinely wire-shaped field: unpadded, as the
 * node serializes it.
 */
const DEPOSIT_PREVIEW = {
  adapter_cap_headroom: { vec: ["998899999999"] },
  aggregate_usage_after: VELOCITY_USAGE,
  blocking_reasons: [
    {
      raw_abort: {
        error_code: "101",
        module_name: "vault",
        // Raw, as the node serializes it — the decoder is what pads.
        package_address: VAULT_PACKAGE_RAW,
      },
      reason_id: { __variant__: "DepositBelowMinimum" },
    },
    {
      raw_abort: {
        error_code: "74",
        module_name: "vault",
        package_address: VAULT_PACKAGE_RAW,
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
  // The two idle limits are one `Option<IdleLimits>` now, not two flat u64 fields.
  idle_limits: {
    vec: [{ max_idle_in_strategy_amount: "500000000", max_idle_in_strategy_duration: "7200" }],
  },
  instant_redeem_fee_bps: "10",
  lock_duration: "86400",
  management_fee_bps: "50",
  max_pending_locked_assets: { vec: ["900000000"] },
  min_deposit_amount: "1000000",
  nav_24h_share_price_deviation_bps: "250",
  nav_deviation_threshold_bps: "100",
  normal_nav_report_interval_seconds: "86400",
  partner_attribution_enabled: true,
  performance_fee_bps: "1000",
  pricing_policy: { __variant__: "Floating" },
  redemptions_paused_until: { vec: ["1784800000"] },
  request_expiry_window: "604800",
  stale_nav_action: { __variant__: "BlockDeposits" },
  underlying_metadata: { inner: "0xabc" },
  withdrawal_delay_seconds: "172800",
};

/**
 * A constructed snapshot, not a live capture. The redeployed vaults are empty, so live
 * reads give `0` for every quantity here except `share_price_e18`, which is `1e18` via the
 * zero-supply branch — and a wall of zeros cannot tell a correct field mapping from a
 * swapped one.
 *
 * Every value is distinct and the accounting identities hold, so a decoder that reads
 * `total_assets` into `equityTotalAssets` (or `share_total_supply` into
 * `equityShareSupply`) fails rather than coincidentally matching:
 *
 *   equity_total_assets = total_assets        - reserved_for_queue
 *   equity_share_supply = share_total_supply   - funded_escrowed_shares
 *   effective_assets    = equity_total_assets  - locked_profit
 *   unreserved_buffer   = (total_assets - strategy_idle_assets) - reserved_for_queue
 *   share_price_e18     = effective_assets * 1e18 / equity_share_supply
 *
 * `locked_profit` is deliberately non-zero: at zero, `effective_assets` collapses onto
 * `equity_total_assets` and the fixture stops distinguishing the two. Every numeric value
 * below is distinct for the same reason.
 *
 * Note `share_price_e18` divides by **equity** supply. Pricing on gross `share_total_supply`
 * is the superseded basis, and a fixture computed that way would ratify the old behaviour.
 */
const VAULT_ACCOUNTING = {
  effective_assets: "17095000000",
  equity_share_supply: "17098100000",
  equity_total_assets: "17096901000",
  funded_escrowed_shares: "95488",
  has_pending_offchain_nav_override: false,
  is_nav_fresh: true,
  last_nav_update_at: "1784721120",
  locked_profit: "1901000",
  reported_offchain_nav: "0",
  reserved_for_queue: "104003",
  share_price_e18: "999818693305104075",
  share_total_supply: "17098195488",
  strategy_idle_assets: "1100000000",
  total_assets: "17097005003",
  unreserved_buffer: "15996901000",
};

/**
 * `queued_redemption_preview`. `force_process_at` is the deadline that would be
 * snapshotted onto the request at submission.
 */
const QUEUED_REDEMPTION_PREVIEW = {
  allocator_sla_seconds: "86400",
  blocking_reasons: [],
  can_submit: true,
  estimated_assets_out: "998500",
  estimated_claimable_at: "1784800000",
  force_process_at: "1784886400",
  is_sanctioned: false,
  is_vault_blocklisted: false,
  pricing_policy: { __variant__: "Floating" },
  request_expiry_at: "1785400000",
  shares_to_escrow: "1000000",
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
    "curatorGenericAdapter",
    "curatorSanctionsOracle",
  ] as const;

  function baseContext() {
    return {
      abis: Object.fromEntries(CURATOR_ABI_KEYS.map((key) => [key, { name: key }])),
      chain: "movement-testnet",
      client: createMovementMock({}),
      deployment: { features: { canopy: false, curator: true, rewards: false, almMeridian: false } },
    };
  }

  it("accepts a context carrying all curator ABIs", () => {
    expect(() => requireCuratorFeatureContext(baseContext() as never)).not.toThrow();
  });

  it.each(CURATOR_ABI_KEYS)("rejects a context missing %s", (missingKey) => {
    // The depositor client reads queue::request_detail and partner_registry::is_registered;
    // CLI management tooling uses the adapter and sanctions-oracle ABIs directly.
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

  it("passes a queued-redemption minAssetsOut through as a bare scalar", () => {
    // Not cosmetic: this value is now persisted on the request and rechecked against
    // the final payout at funding time, so dropping it silently widens the user's
    // accepted slippage to unbounded.
    const { sdk } = createCuratorSdk();

    expect(
      sdk.curator!.buildRequestRedemptionPayload({
        vaultAddress: FLOATING_VAULT,
        shares: 1_000_000n,
        minAssetsOut: 995_000n,
      })
    ).toMatchObject({
      function: `${ROUTER_PACKAGE}::router::request_redemption`,
      functionArguments: [normalizeMoveAddress(FLOATING_VAULT), "1000000", "995000"],
    });
  });
});

describe("curator reads", () => {
  it("decodes the vault_accounting snapshot, keeping equity and gross figures apart", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vault_accounting`]: [VAULT_ACCOUNTING],
    });

    await expect(sdk.curator!.getVaultAccounting(FLOATING_VAULT)).resolves.toEqual({
      effectiveAssets: 17095000000n,
      equityShareSupply: 17098100000n,
      equityTotalAssets: 17096901000n,
      fundedEscrowedShares: 95488n,
      hasPendingOffchainNavOverride: false,
      isNavFresh: true,
      lastNavUpdateAt: 1784721120n,
      lockedProfit: 1901000n,
      reportedOffchainNav: 0n,
      reservedForQueue: 104003n,
      sharePriceE18: 999818693305104075n,
      shareTotalSupply: 17098195488n,
      strategyIdleAssets: 1100000000n,
      totalAssets: 17097005003n,
      unreservedBuffer: 15996901000n,
    });
  });

  it("decodes the queued redemption preview, including the force-process deadline", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::queued_redemption_preview`]: [QUEUED_REDEMPTION_PREVIEW],
    });

    await expect(
      sdk.curator!.previewQueuedRedemption({
        vaultAddress: FLOATING_VAULT,
        user: DEPOSITOR,
        shares: 1_000_000n,
      })
    ).resolves.toEqual({
      allocatorSlaSeconds: 86400n,
      blockingReasons: [],
      canSubmit: true,
      estimatedAssetsOut: 998500n,
      estimatedClaimableAt: 1784800000n,
      forceProcessAt: 1784886400n,
      isSanctioned: false,
      isVaultBlocklisted: false,
      pricingPolicy: "Floating",
      requestExpiryAt: 1785400000n,
      sharesToEscrow: 1000000n,
    });
  });

  it("passes a present queued-preview minAssetsOut as a bare scalar", async () => {
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::queued_redemption_preview`]: [QUEUED_REDEMPTION_PREVIEW],
    });

    await sdk.curator!.previewQueuedRedemption({
      vaultAddress: FLOATING_VAULT,
      user: DEPOSITOR,
      shares: 1_000_000n,
      minAssetsOut: 998_000n,
    });

    const payload = (client.view.mock.calls[0]?.[0] as {
      payload: { functionArguments: unknown[] };
    }).payload;
    expect(payload.functionArguments[3]).toBe("998000");
  });

  it("decodes deposit_preview blocking reasons including enum variants", async () => {
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::deposit_preview`]: [DEPOSIT_PREVIEW],
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
      [`${VAULT_PACKAGE}::vault::deposit_preview`]: [DEPOSIT_PREVIEW],
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
    expect(config.nav24hSharePriceDeviationBps).toBe(250n);
    expect(config.normalNavReportIntervalSeconds).toBe(86400n);
    // Both idle limits arrive as one Option<IdleLimits>, so they are present or
    // absent together — never one without the other.
    expect(config.idleLimits).toEqual({
      maxIdleInStrategyAmount: 500000000n,
      maxIdleInStrategyDuration: 7200n,
    });
  });

  it("decodes an absent idle-limits option as null, not zeroed limits", async () => {
    // `{ vec: [] }` means the vault sets no idle ceiling at all. Decoding that to
    // `{ amount: 0n, duration: 0n }` would read as "no idle capital permitted",
    // the exact opposite of the truth.
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::vault_config_view`]: [
        { ...VALID_VAULT_CONFIG, idle_limits: { vec: [] } },
      ],
    });

    await expect(sdk.curator!.getVaultConfig(FLOATING_VAULT)).resolves.toMatchObject({
      idleLimits: null,
    });
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
          ownership_chain_too_deep: false,
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
    // Third gate alongside sanctions and the vault blocklist.
    expect(position.ownershipChainTooDeep).toBe(false);
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
            force_process_at: "1784886400",
            frozen_at: { vec: [] },
            funded_amount: "0",
            funded_at: { vec: [] },
            locked_assets_out: isCancelled ? { vec: [] } : { vec: ["999000"] },
            // Both Option branches of the persisted floor, in one fixture.
            min_assets_out: isCancelled ? { vec: [] } : { vec: ["995000"] },
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
    // fundedAmount is 0 before the request is funded — by an allocator or by
    // permissionless force-processing; lockedAssetsOut carries the LockedIn payout
    // estimate instead.
    expect(requests[0]?.fundedAmount).toBe(0n);
    expect(requests[0]?.lockedAssetsOut).toBe(999000n);
    expect(requests[0]?.submittedAt).toBe(1784700000n);
    expect(requests[1]?.lockedAssetsOut).toBeNull();

    // The persisted floor decodes in both directions: `null` must mean "no floor",
    // never a zeroed one, since a zero floor is itself a valid contract state.
    expect(requests[0]?.minAssetsOut).toBe(995000n);
    expect(requests[1]?.minAssetsOut).toBeNull();

    // The stored snapshot, deliberately distinct from claimableAt and expiresAt so a
    // decoder reading the wrong u64 cannot pass.
    expect(requests[0]?.storedForceProcessAt).toBe(1784886400n);
  });

  it("reads the effective force-process deadline from the vault, not the request", async () => {
    // The stored snapshot is an upper bound; the contract enforces
    // min(claimableAt + live SLA, snapshot), so a tightened SLA moves the real
    // deadline earlier. The getter must go to the vault view, passing vault first.
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::request_force_process_at`]: ["1784800001"],
    });

    // Deliberately non-canonical inputs. Both constants are already 64-hex lowercase, so
    // passing them straight through would let a getter that skipped normalizeMoveAddress
    // entirely still pass the assertion below.
    await expect(
      sdk.curator!.getRequestForceProcessAt({
        vaultAddress: denormalized(FLOATING_VAULT),
        requestAddress: denormalized(REQUEST),
      })
    ).resolves.toBe(1784800001n);

    const payload = (client.view.mock.calls[0]?.[0] as {
      payload: { function: string; functionArguments: unknown[] };
    }).payload;
    expect(payload.function).toBe(`${VAULT_PACKAGE}::vault::request_force_process_at`);
    expect(payload.functionArguments).toEqual([
      normalizeMoveAddress(FLOATING_VAULT),
      normalizeMoveAddress(REQUEST),
    ]);
  });

  it("reads the active lock duration and the effective NAV deviation separately", async () => {
    // Neither is carried by any composite DTO this SDK exposes: active_lock_duration can
    // lag config.lockDuration while a profit schedule runs, and the effective NAV bound is
    // the stored config clamped to SystemBounds. (On-chain the latter also appears as
    // nav_24h_share_price_band.threshold_bps, which the SDK does not bind.)
    const { sdk, client } = createCuratorSdk({
      [`${VAULT_PACKAGE}::vault::active_lock_duration`]: ["604800"],
      [`${VAULT_PACKAGE}::vault::effective_nav_24h_share_price_deviation_bps`]: ["150"],
    });

    // Non-canonical input here too, for the same reason as above.
    await expect(
      sdk.curator!.getActiveLockDuration(denormalized(FLOATING_VAULT))
    ).resolves.toBe(604800n);
    await expect(
      sdk.curator!.getEffectiveNav24hSharePriceDeviationBps(denormalized(FLOATING_VAULT))
    ).resolves.toBe(150n);

    for (const call of client.view.mock.calls) {
      const payload = (call[0] as { payload: { functionArguments: unknown[] } }).payload;
      expect(payload.functionArguments).toEqual([normalizeMoveAddress(FLOATING_VAULT)]);
    }
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

  // The case above never reaches the abort: `is_registered` answers false and the second
  // view is skipped. This one covers the race the method actually documents — the partner
  // is removed between the two calls.
  //
  // The payload below is captured verbatim from movement-testnet, by calling
  // `partner_registry::payout_address` with an unregistered id. `/v1/view` does not use the
  // `Move abort in …: ENAME(0xHEX)` wording that simulation does: there is no name, no
  // description, and the code is in `sub_status`. Parsing that is what makes this branch
  // reachable — an invented `ENAME` string passes while production still fails.
  it("returns null when a partner is removed between the registration check and the payout read", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::partner_registry::is_registered`]: [true],
      [`${VAULT_PACKAGE}::partner_registry::payout_address`]: () => {
        // Thrown the way the Aptos SDK does, with the body under `data`.
        throw Object.assign(new Error("Move abort"), {
          data: {
            // Frozen literal, not interpolated. The previous version built `message:`
            // from the package constant while hard-coding a different package in
            // `location:`, so it described a transaction that never happened. Recaptured
            // whole against this deployment; note the node pads inside `message:` and
            // omits the `0x` inside `location:`.
            message:
              "Failed to execute function: VMError { major_status: ABORTED, sub_status: Some(2), " +
              'message: Some("0x08e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b' +
              '::partner_registry::payout_address at offset 17"), ' +
              "exec_state: Some(ExecutionState { stack_trace: [] }), location: Module(ModuleId { " +
              "address: 08e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b, " +
              'name: Identifier("partner_registry") }), indices: [], offsets: [(FunctionDefinitionIndex(2), 17)] }',
            error_code: "invalid_input",
            vm_error_code: null,
          },
        });
      },
    });

    await expect(sdk.curator!.getPartnerPayoutAddress(7n)).resolves.toBeNull();
  });

  it("rethrows a payout_address failure that is not a move abort", async () => {
    const { sdk } = createCuratorSdk({
      [`${VAULT_PACKAGE}::partner_registry::is_registered`]: [true],
      [`${VAULT_PACKAGE}::partner_registry::payout_address`]: () => {
        throw new Error("connection reset");
      },
    });

    await expect(sdk.curator!.getPartnerPayoutAddress(7n)).rejects.toMatchObject({
      code: "VIEW_CALL_FAILED",
    });
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
          force_process_at: "1784886400",
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
      storedForceProcessAt: 1784886400n,
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
            force_process_at: "1784886400",
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

describe("findRedemptionFundingMinimumNotMetEvent", () => {
  const minimumNotMetEvent = {
    type: `${VAULT_PACKAGE}::vault::RedemptionFundingMinimumNotMetEvent`,
    data: {
      attempted_at: "1784886400",
      attempted_by: DEPOSITOR,
      calculated_assets_out: "990000",
      min_assets_out: "1000000",
      request_object_address: REQUEST,
      vault: FLOATING_VAULT,
    },
  };

  it("explains why a redemption request remained pending", () => {
    expect(
      findRedemptionFundingMinimumNotMetEvent({
        events: [{ type: "0x1::fungible_asset::Withdraw", data: {} }, minimumNotMetEvent],
      })
    ).toEqual({
      attemptedAt: 1784886400n,
      attemptedBy: normalizeMoveAddress(DEPOSITOR),
      calculatedAssetsOut: 990000n,
      minAssetsOut: 1000000n,
      requestAddress: normalizeMoveAddress(REQUEST),
      vaultAddress: normalizeMoveAddress(FLOATING_VAULT),
    });
  });

  it("returns every matching event in emission order and supports filters", () => {
    const otherRequest = "0x123";
    const second = {
      ...minimumNotMetEvent,
      data: { ...minimumNotMetEvent.data, request_object_address: otherRequest },
    };
    const txResult = { events: [minimumNotMetEvent, second] };

    expect(findRedemptionFundingMinimumNotMetEvents(txResult)).toHaveLength(2);
    expect(
      findRedemptionFundingMinimumNotMetEvents(txResult, { requestAddress: otherRequest })
    ).toEqual([
      expect.objectContaining({ requestAddress: normalizeMoveAddress(otherRequest) }),
    ]);
    expect(
      findRedemptionFundingMinimumNotMetEvents(txResult, { vaultAddress: QUEUE })
    ).toEqual([]);
    expect(
      findRedemptionFundingMinimumNotMetEvents(txResult, { packageAddress: ROUTER_PACKAGE })
    ).toEqual([]);
  });

  it.each([
    ["attempted_at", undefined],
    ["calculated_assets_out", ""],
    ["min_assets_out", "not-a-number"],
  ])("throws when numeric field %s is malformed", (field, value) => {
    expect(() =>
      findRedemptionFundingMinimumNotMetEvent({
        events: [
          {
            ...minimumNotMetEvent,
            data: { ...minimumNotMetEvent.data, [field]: value },
          },
        ],
      })
    ).toThrow(new RegExp(field));
  });

  it.each(["attempted_by", "request_object_address", "vault"])(
    "throws when address field %s is missing",
    (field) => {
      expect(() =>
        findRedemptionFundingMinimumNotMetEvent({
          events: [
            {
              ...minimumNotMetEvent,
              data: { ...minimumNotMetEvent.data, [field]: undefined },
            },
          ],
        })
      ).toThrow(new RegExp(field));
    }
  );

  it("returns undefined when the transaction has no matching event", () => {
    expect(findRedemptionFundingMinimumNotMetEvent({ events: [] })).toBeUndefined();
    expect(findRedemptionFundingMinimumNotMetEvent({})).toBeUndefined();
  });
});
