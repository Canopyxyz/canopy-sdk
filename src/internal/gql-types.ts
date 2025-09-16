export interface AdditionalMetadata {
  item: string;
  key: string;
  __typename: string;
}

export interface CanopyMetadataItem {
  id: string;
  chainId: number;
  networkAddress: string;
  displayName: string;
  investmentType: string;
  networkType: string;
  riskScore: number;
  priority: number;
  isHidden: boolean | null;
  description: string;
  iconURL: string;
  labels: string[];
  rewardPools: string[] | null;
  additionalMetadata: AdditionalMetadata[];
  paused: boolean;
  token0: string;
  token1: string;
  allowToken0: boolean;
  allowToken1: boolean;
  tvl: string;
  totalSupply: string | null;
  token0Balance: string;
  token1Balance: string;
  decimals0: number;
  decimals1: number;
  apr: string;
  rewardApr: string;
  __typename: string;
}

export interface ListCanopyMetadataResponse {
  items: CanopyMetadataItem[];
  __typename: string;
}

export interface GetCanopyMetadataResponse {
  listCanopyMetadata: ListCanopyMetadataResponse;
}

export interface GetCanopyMetadataVariables {
  chainId: number;
}

export interface GraphQLRequest<T = any> {
  operationName: string;
  variables: T;
  query: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: any;
  }>;
}

export interface VaultMetadata {
  address: string;
  displayName: string;
  description: string;
  iconURL: string;
  investmentType: string;
  networkType: string;
  riskScore: number;
  labels: string[];
  paused: boolean;
  tvl: string;
  apr: string;
  rewardApr: string;
  token0: string;
  token1: string;
  token0Balance: string;
  token1Balance: string;
  decimals0: number;
  decimals1: number;
  totalSupply: string;
  rewardPools: string[];
  additionalMetadata: Record<string, string>;
}
