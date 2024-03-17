import { processData } from "./processData";

describe("processData", () => {
  it("should normalize trade data correctly", () => {
    const rawData = {
      e: "trade",
      E: 1623681734000,
      s: "BTCUSDT",
      p: "40000.00",
      q: "0.1",
      t: 123456,
      m: false,
      T: 1623681734000,
    };

    const expectedData = {
      eventType: "trade",
      eventTime: 1623681734000,
      symbol: "BTCUSDT",
      price: "40000.00",
      quantity: "0.1",
      tradeId: 123456,
      isBuyerMaker: false,
      tradeTime: 1623681734000,
    };

    const normalizedData = processData(JSON.stringify(rawData));

    expect(normalizedData).toEqual(expectedData);
  });

  // Add more test cases for different scenarios
});
