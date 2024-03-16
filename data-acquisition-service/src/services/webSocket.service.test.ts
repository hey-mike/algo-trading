import WebSocket from "ws";
import { connectToMarketDataStream } from "./webSocket.service";
import { processData } from "../utils/processData";
import { config } from "../config";

jest.mock("ws");
jest.mock("../utils/processData");

describe("WebSocket Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to Binance WebSocket and process data", () => {
    const symbol = "BTCUSDT";
    const mockData = { e: "trade" };

    connectToMarketDataStream(symbol);

    expect(WebSocket).toHaveBeenCalledWith(
      `${config.BINANCE_WS_URL}/${symbol}`
    );

    const mockWebSocketInstance = WebSocket.mock.instances[0];
    const messageCallback = mockWebSocketInstance.on.mock.calls[1][1];
    messageCallback(JSON.stringify(mockData));

    expect(processData).toHaveBeenCalledWith(JSON.stringify(mockData));
  });

  // Add more test cases for error scenarios and edge cases
});
