import { cacheData, getCachedData, removeCachedData } from "./cache.service";
import redis from "./redis.client";

jest.mock("./redis.client");

describe("Cache Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should cache data successfully", async () => {
    const data = { foo: "bar" };
    const key = "test-key";

    await cacheData(data, key);

    expect(redis.set).toHaveBeenCalledWith(
      key,
      JSON.stringify(data),
      "EX",
      expect.any(Number)
    );
  });

  it("should retrieve cached data successfully", async () => {
    const data = { foo: "bar" };
    const key = "test-key";

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(data));

    const cachedData = await getCachedData(key);

    expect(redis.get).toHaveBeenCalledWith(key);
    expect(cachedData).toEqual(data);
  });

  // Add more test cases for error scenarios and edge cases
});
