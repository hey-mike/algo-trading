// webSocket.ts
import { Server, Socket } from "socket.io";
import http from "http";
import logger from "../utils/logger";

export class WebSocketService {
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server);
    this.initialize();
  }

  private initialize(): void {
    this.io.on("connection", this.onConnection.bind(this));
    logger.info("WebSocket server initialized");
  }

  private onConnection(socket: Socket): void {
    logger.info("WebSocket client connected");

    socket.on("disconnect", this.onDisconnect.bind(this, socket));
    socket.on("error", this.onError.bind(this, socket));

    // Send a welcome message to the connected client
    socket.emit("message", {
      type: "welcome",
      message: "Welcome to the Trading Bot Server",
    });
  }

  private onDisconnect(socket: Socket): void {
    logger.info("WebSocket client disconnected");
  }

  private onError(socket: Socket, err: Error): void {
    logger.error("WebSocket error:", err);
  }

  public broadcastMessage(event: string, message: any): void {
    this.io.emit(event, message);
  }

  public sendMessage(socket: Socket, event: string, message: any): void {
    socket.emit(event, message);
  }
}
