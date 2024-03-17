// trading-bot-server/src/socketServer.ts
import { Server as SocketIOServer } from "socket.io";
import { io as Client } from "socket.io-client";

export const setupWebSocketServer = (httpServer: any) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Adjust according to your security requirements
    },
  });

  const dataServiceSocket = Client("ws://data-acquisition-service");

  dataServiceSocket.on("connect", () => {
    console.log("Connected to Data Acquisition Service");
  });

  dataServiceSocket.on("realtime-data", (data) => {
    // Emit data to all connected Client App clients
    io.emit("realtime-update", data);
  });

  return io;
};
