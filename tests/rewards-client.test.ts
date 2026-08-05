import { CanopySdk } from "../packages/sdk/src";
import { createMovementMock } from "./fixtures/view-client-mock";

describe("Rewards client", () => {
  it("builds rewards payloads and parses rewards views", async () => {
    const client = createMovementMock({
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_earned":
        ["42"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_pool_info":
        [{ inner: "0xa" }, [{ inner: "0xb" }, { inner: "0xc" }], "7"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::is_user_subscribed":
        (args: unknown[]) => [String(args[1]).endsWith("000b")],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const rewards = sdk.rewards!;

    expect(
      rewards.buildStakeCoinPayload({
        coinType: "0x1::aptos_coin::AptosCoin",
        amount: 10n,
      })
    ).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: ["10"],
    });

    expect(
      rewards.buildStakeAndSubscribeAssetPayload({
        stakingAsset: "0xA",
        amount: 11n,
        poolAddresses: ["0xB", "0xC"],
      })
    ).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake_and_subscribe_fa",
      typeArguments: [],
      functionArguments: [
        "0x000000000000000000000000000000000000000000000000000000000000000a",
        "11",
        [
          "0x000000000000000000000000000000000000000000000000000000000000000b",
          "0x000000000000000000000000000000000000000000000000000000000000000c",
        ],
      ],
    });

    expect(
      await rewards.getEarned({
        userAddress: "0x1",
        poolAddress: "0x2",
        rewardTokenAddress: "0x3",
      })
    ).toBe(42n);

    expect(await rewards.getPoolInfo("0x4")).toEqual({
      stakingAsset: "0x000000000000000000000000000000000000000000000000000000000000000a",
      rewardTokenAddresses: [
        "0x000000000000000000000000000000000000000000000000000000000000000b",
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      ],
      totalStaked: 7n,
    });

    expect(
      await rewards.getUnsubscribedPools({
        userAddress: "0x1",
        poolAddresses: ["0xb", "0xc"],
      })
    ).toEqual(["0x000000000000000000000000000000000000000000000000000000000000000c"]);
  });

  it("supports the missing rewards builders and staking views", async () => {
    const client = createMovementMock({
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_user_staked_balance":
        ["21"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_user_subscribed_pools":
        [[{ inner: "0xa" }]],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_pool_info":
        [{ inner: "0x123" }, [{ inner: "0xb" }], "7"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_earned":
        ["42"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_reward_data":
        ["0xc", "100", "200", "300", "400", "500"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_unallocated_rewards":
        ["600"],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const rewards = sdk.rewards!;

    expect(rewards.buildSubscribePayload({ poolAddress: "0xA" })).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::subscribe",
      typeArguments: [],
      functionArguments: ["0x000000000000000000000000000000000000000000000000000000000000000a"],
    });

    expect(rewards.buildUnsubscribePayload({ poolAddress: "0xA" })).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::unsubscribe",
      typeArguments: [],
      functionArguments: ["0x000000000000000000000000000000000000000000000000000000000000000a"],
    });

    expect(
      rewards.buildUnsubscribeAndWithdrawAssetPayload({
        stakingAsset: "0x123",
        amount: 5n,
        poolAddresses: ["0xA"],
      })
    ).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::unsubscribe_and_withdraw_fa",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000123",
        "5",
        ["0x000000000000000000000000000000000000000000000000000000000000000a"],
      ],
    });

    expect(
      rewards.buildCreateStakingPoolPayload({
        coinType: "0x1::aptos_coin::AptosCoin",
      })
    ).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::create_staking_pool",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [],
    });

    expect(
      rewards.buildStakeTokenPayload({
        amount: 5n,
        tokenCreator: "0x123",
        tokenName: "Vault Share",
        tokenSymbol: "VSHARE",
        tokenDecimals: 8,
        poolAddresses: ["0xA"],
      })
    ).toMatchObject({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake_and_subscribe_token",
      typeArguments: [],
      functionArguments: [
        ["0x000000000000000000000000000000000000000000000000000000000000000a"],
        "5",
        "0x0000000000000000000000000000000000000000000000000000000000000123",
        "Vault Share",
        "VSHARE",
        "8",
      ],
    });

    await expect(
      rewards.getUserStakedBalance({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toBe(21n);

    await expect(
      rewards.getUserSubscribedPools({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toEqual([
      "0x000000000000000000000000000000000000000000000000000000000000000a",
    ]);

    await expect(rewards.getRewardData("0xA", "0xB")).resolves.toEqual({
      lastUpdateTime: 300n,
      periodFinish: 200n,
      rewardPerTokenStored: 500n,
      rewardRate: 400n,
      rewardsDistributor:
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      rewardsDuration: 100n,
      unallocatedRewards: 600n,
    });

    await expect(
      rewards.getUserStakingPosition({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toEqual({
      pendingRewards: [
        {
          amount: 42n,
          poolAddress:
            "0x000000000000000000000000000000000000000000000000000000000000000a",
          rewardTokenAddress:
            "0x000000000000000000000000000000000000000000000000000000000000000b",
        },
      ],
      stakingAsset:
        "0x0000000000000000000000000000000000000000000000000000000000000123",
      subscribedPools: [
        "0x000000000000000000000000000000000000000000000000000000000000000a",
      ],
      totalStaked: 21n,
    });
  });
});
