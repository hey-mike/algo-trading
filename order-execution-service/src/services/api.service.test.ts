import axios from "axios";
import { fetchMarketData } from "./api.service";
import { config } from "../config";

jest.mock("axios");

describe("API Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch market data successfully", async () => {
    const symbol = "BTCUSDT";
    const mockResponse = { data: { price: "40000.00" } };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const marketData = await fetchMarketData(symbol);

    expect(axios.get).toHaveBeenCalledWith(`${config.REST_API_URL}/${symbol}`, {
      headers: { "X-API-KEY": config.API_KEY },
    });
    expect(marketData).toEqual(mockResponse.data);
  });

  // Add more test cases for error scenarios
});
