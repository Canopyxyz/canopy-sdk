export interface Instrument {
  name: string;
  symbol?: string;
  decimals?: number;
}

export interface Collateral {
  instrument: Instrument;
  amount: string;
}

export interface Liability {
  instrument: Instrument;
  amount: string;
}

export interface PortfolioData {
  address: string;
  collaterals: Collateral[];
  liabilities: Liability[];
}

export interface PortfolioState {
  collaterals: Array<{
    instrumentId: string;
    amount: string;
  }>;
  liabilities: Array<{
    instrumentId: string;
    amount: string;
  }>;
}

export interface PacketResponse {
  packet: string;
  signature?: string;
  timestamp?: number;
}

export interface ComputePacketData {
  network: string;
  address: string;
  brokerName: string;
  amount: string;
  operation: "lend" | "redeem";
  movepositionApiUrl: string;
}

export interface CreatePacketRequest {
  amount: string;
  network: string;
  brokerName: string;
  signerPubkey: string;
  currentPortfolioState: PortfolioState;
}

export interface MovePositionConfig {
  apiUrl: string;
  nameMap: Record<string, string>;
  virtualCoinMap: Record<string, string>;
}
