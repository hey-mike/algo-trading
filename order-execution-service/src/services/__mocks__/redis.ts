const RedisMock = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  // Add other methods and properties as needed
}));

export default RedisMock;
