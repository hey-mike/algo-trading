// webSocket.service.test.ts
import WebSocket from "ws";
import { initializeWebSocketConnection } from "./webSocket.service";
import { processData } from "../utils/processData";
import { cacheData } from "./cache.service";

jest.mock("ws");
jest.mock("./processData");
jest.mock("./cache.service");

describe("WebSocket Service", () => {
  let mockWebSocket: WebSocket;

  beforeEach(() => {
    mockWebSocket = new WebSocket("ws://localhost");
    (WebSocket as jest.Mock).mockImplementation(() => mockWebSocket);
    (processData as jest.Mock).mockReturnValue({
      symbol: "BTCUSDT",
      tradeId: 123,
    });
    (cacheData as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should establish WebSocket connection and handle incoming messages", () => {
    initializeWebSocketConnection();

    expect(WebSocket).toHaveBeenCalledWith(
      "wss://stream.binance.com:9443/ws/btcusdt@trade"
    );

    const onOpenCallback = (mockWebSocket.on as jest.Mock).mock.calls[0][1];
    onOpenCallback();
    expect(console.log).toHaveBeenCalledWith(
      "WebSocket connection established"
    );

    const onMessageCallback = (mockWebSocket.on as jest.Mock).mock.calls[1][1];
    const mockData = JSON.stringify({ symbol: "BTCUSDT", tradeId: 123 });
    onMessageCallback(mockData);
    expect(processData).toHaveBeenCalledWith(JSON.parse(mockData));
    expect(cacheData).toHaveBeenCalledWith(
      { symbol: "BTCUSDT", tradeId: 123 },
      "processed_data_BTCUSDT_123"
    );

    const onErrorCallback = (mockWebSocket.on as jest.Mock).mock.calls[2][1];
    const mockError = new Error("WebSocket error");
    onErrorCallback(mockError);
    expect(console.error).toHaveBeenCalledWith("WebSocket error:", mockError);

    const onCloseCallback = (mockWebSocket.on as jest.Mock).mock.calls[3][1];
    onCloseCallback();
    expect(console.log).toHaveBeenCalledWith("WebSocket connection closed");
  });
});
