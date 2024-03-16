// webSocket.service.test.ts
import WebSocket from "ws";
import { initializeWebSocketConnection } from "./webSocket.service";
import { processData } from "../utils/processData";
import { cacheData } from "./cache.service";
import * as logger from "../utils/logger";

jest.mock("ws");
jest.mock("../utils/processData");
jest.mock("./cache.service");

describe("WebSocket Service", () => {
  let mockWebSocket: WebSocket;
  let infoLogSpy: jest.SpyInstance;
  let errorLogSpy: jest.SpyInstance;

  beforeEach(() => {
    mockWebSocket = new WebSocket("ws://localhost");
    (WebSocket as any as jest.Mock).mockImplementation(() => mockWebSocket);
    (processData as jest.Mock).mockReturnValue({
      symbol: "BTCUSDT",
      tradeId: 123,
    });
    (cacheData as jest.Mock).mockResolvedValue(undefined);

    infoLogSpy = jest.spyOn(logger, "info").mockImplementation();
    errorLogSpy = jest.spyOn(logger, "error").mockImplementation();
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
    expect(infoLogSpy).toHaveBeenCalledWith("WebSocket connection established");

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
    expect(errorLogSpy).toHaveBeenCalledWith("WebSocket error:", mockError);

    const onCloseCallback = (mockWebSocket.on as jest.Mock).mock.calls[3][1];
    onCloseCallback();
    expect(infoLogSpy).toHaveBeenCalledWith("WebSocket connection closed");
  });
});
