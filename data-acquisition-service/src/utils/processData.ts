interface TradeData {
    eventType: string;
    eventTime: number;
    symbol: string;
    price: string;
    quantity: string;
    tradeId: number;
    isBuyerMaker: boolean;
    tradeTime: number;
  }
  
  // Function to process and normalize trade data received from Binance WebSocket
  export const processData = (data: string): TradeData => {
    const rawData = JSON.parse(data);
  
    const normalizedData: TradeData = {
      eventType: rawData.e,
      eventTime: rawData.E,
      symbol: rawData.s,
      price: rawData.p,
      quantity: rawData.q,
      tradeId: rawData.t,
      isBuyerMaker: rawData.m,
      tradeTime: rawData.T,
    };
  
    // Example: Log the normalized data
    console.log(`Trade for ${normalizedData.symbol}: ${normalizedData.quantity} @ ${normalizedData.price}`);
  
    // Here, you could add additional logic, such as storing the data in a database or further processing.
  
    return normalizedData;
  };
  