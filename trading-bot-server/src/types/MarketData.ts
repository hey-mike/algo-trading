export interface MarketData {
  eventType: string;
  eventTime: number;
  symbol: string;
  price: string;
  quantity: string;
  tradeId: number;
  isBuyerMaker: boolean;
  tradeTime: number;
}
