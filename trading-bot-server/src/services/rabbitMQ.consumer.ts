// rabbitMQConsumer.ts
import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { config } from "../config";
import { MarketData } from "../types/MarketData";
import { WebSocketService } from "./websocket.service";
import logger from "../utils/logger";

export class RabbitMQConsumer {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;
  private connectionAttempts: number = 0;

  constructor(private webSocketService: WebSocketService) {}

  public async connect(): Promise<void> {
    try {
      await this.ensureConnection();
      await this.consumeMarketData();
    } catch (err) {
      logger.error("Error connecting to RabbitMQ:", err);
      throw err;
    }
  }

  private async handleError(message: string): Promise<void> {
    logger.error(message);
    this.channel = null;
    this.connection = null;
    this.isConnecting = false;
    await this.reconnectWithBackoff();
  }

  private async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) return;
    if (this.isConnecting) return;

    try {
      this.isConnecting = true;
      this.connection = await amqp.connect(config.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(
        config.RABBITMQ_MARKET_EXCHANGE,
        config.RABBITMQ_EXCHANGE_TYPE,
        {
          durable: true,
        }
      );
      this.connectionAttempts = 0;

      this.connection.on("close", async () => {
        this.handleError(
          "RabbitMQ connection closed. Attempting to reconnect..."
        );
      });

      this.connection.on("error", (err) => {
        this.handleError(`RabbitMQ connection error: ${err}`);
      });
    } catch (err) {
      this.handleError(`Failed to connect to RabbitMQ: ${err}`);
    } finally {
      this.isConnecting = false;
    }
  }

  private async consumeMarketData(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel is not available for consuming market data.");
    }

    const queue = "market_data_queue";
    const routingKey = "market_data.BTCUSDT";

    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(
      queue,
      config.RABBITMQ_MARKET_EXCHANGE,
      routingKey
    );

    logger.info(`Consuming market data from queue: ${queue}`);

    this.channel.consume(
      queue,
      (message: ConsumeMessage | null) => {
        if (message) {
          try {
            if (message.content) {
              const marketData: MarketData = JSON.parse(
                message.content.toString("utf8")
              );
              // logger.info("Received market data:", marketData);
              this.processMarketData(marketData);
              this.channel?.ack(message);
            }
          } catch (err) {
            logger.error("Error parsing market data:", err);
            // Handle the parsing error, e.g., nack the message or publish to an error queue
          }
        } else {
          logger.warn("Received empty message");
        }
      },
      { noAck: false }
    );
  }

  private processMarketData(marketData: MarketData): void {
    // Broadcast the market data to connected WebSocket clients
    this.webSocketService.broadcastMessage("marketData", { data: marketData });
    // Perform any additional processing or storage of market data
    // ...
  }

  private reconnectWithBackoff(): void {
    if (this.connectionAttempts >= 5) {
      logger.error("Maximum connection attempts reached. Giving up.");
      return;
    }

    const backoffTime = Math.pow(2, this.connectionAttempts) * 1000;
    this.connectionAttempts++;

    setTimeout(() => {
      logger.warn(
        `Attempting to reconnect to RabbitMQ. Attempt ${this.connectionAttempts}`
      );
      this.ensureConnection();
    }, backoffTime);
  }

  public async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    logger.info("Disconnected from RabbitMQ");
  }
}
