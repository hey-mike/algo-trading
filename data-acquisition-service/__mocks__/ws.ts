// __mocks__/ws.ts
const mockWebSocket = {
  on: jest.fn(),
  // Add other methods and properties as needed
};

const WebSocketMock = jest.fn(() => mockWebSocket);

export default WebSocketMock;
