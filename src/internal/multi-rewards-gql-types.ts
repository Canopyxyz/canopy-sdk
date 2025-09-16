export interface MRModule {
  __typename: string;
  id: string;
  pool_count: number;
  user_count: number;
  last_update_time: string;
}

export interface MRPoolRewardData {
  __typename: string;
  id: string;
  pool_address: string;
  reward_token: string;
  reward_balance: string;
  distributor: string;
  duration: string;
  period_finish: string;
  last_update_time: string;
  reward_rate_u12: string;
  reward_per_token_stored_u12: string;
  unallocated_rewards: string;
  total_distributed: string;
}

export interface MRStakingPool {
  __typename: string;
  id: string;
  module: MRModule;
  creation_tx_version: string;
  creator: string;
  staking_token: string;
  reward_tokens: string[];
  reward_datas: MRPoolRewardData[];
  withdrawal_count: number;
  claim_count: number;
  subscriber_count: number;
  total_subscribed: string;
  created_at: string;
}

export interface GetMRStakingPoolsResponse {
  mrstakingPools: MRStakingPool[];
}

export interface GetMRStakingPoolsByTokenVariables {
  stakingToken: string;
}

export interface GraphQLRequest<TVariables = {}> {
  operationName: string;
  variables: TVariables;
  query: string;
}

export interface GraphQLResponse<TData = any> {
  data?: TData;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}