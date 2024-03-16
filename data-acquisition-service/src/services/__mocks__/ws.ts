// __mocks__/ws.ts
const WebSocketMock = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  // Add other methods and properties as needed
}));

export default WebSocketMock;
