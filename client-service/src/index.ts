// client-service/src/index.ts
import http from "http";
import app from "./app";
import { setupWebSocketServer } from "./services/socket.server";

const httpServer = http.createServer(app);
const io = setupWebSocketServer(httpServer);

httpServer.listen(5002, () => {
  console.log("Client Service listening on port 5002");
});
