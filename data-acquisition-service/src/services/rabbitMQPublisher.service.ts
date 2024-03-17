import amqp from "amqplib";
import { config } from "../config"; // Ensure this points to your actual config file
import { info, error } from "../utils/logger";
import { MarketData } from "../types/MarketData";

class RabbitMQPublisher {
  private channel: amqp.Channel | null = null;
  private connection: amqp.Connection | null = null;
  private isConnected: boolean = false;

  constructor(
    private url: string = config.RABBITMQ_HOST,
    private exchange: string = "marketData",
    private exchangeType: string = "topic"
  ) {
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<void> {
    if (this.isConnected) return;

    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, this.exchangeType, {
        durable: false,
      });
      this.isConnected = true;

      this.connection.on("close", async () => {
        error("RabbitMQ connection closed. Attempting to reconnect...");
        this.isConnected = false;
        this.channel = null;
        this.connection = null;
        await this.retryConnection();
      });

      this.connection.on("error", (err) => {
        error("RabbitMQ connection error:", err);
        this.isConnected = false;
      });
    } catch (err) {
      error("Failed to connect to RabbitMQ:", err);
      error("RabbitMQ URL:", this.url);
      await this.retryConnection();
    }
  }
  private async retryConnection(retryCount: number = 1): Promise<void> {
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    const maxRetries = 5;

    try {
      await this.ensureConnection();
    } catch (err) {
      if (retryCount < maxRetries) {
        error(
          `Retrying RabbitMQ connection in ${retryDelay}ms (attempt ${
            retryCount + 1
          })`
        );
        setTimeout(() => this.retryConnection(retryCount + 1), retryDelay);
      } else {
        error("Max retry attempts reached. Unable to connect to RabbitMQ.");
        throw err;
      }
    }
  }

  public async shutdown(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
    info("RabbitMQ connection closed.");
  }

  public async publish(data: MarketData): Promise<void> {
    await this.ensureConnection();

    if (!this.channel) {
      throw new Error("Unable to publish message: Channel is not available.");
    }

    try {
      const routingKey = `marketData.${data.symbol}`;
      this.channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(JSON.stringify(data)),
        {
          persistent: true,
        }
      );
      //   info(
      //     `Published data to ${this.exchange} exchange with routing key ${routingKey}`
      //   );
    } catch (err) {
      error("Error publishing message:", err);
      throw err; // Re-throw to allow caller to handle the error
    }
  }
}

export const rabbitMQPublisher = new RabbitMQPublisher(
  config.RABBITMQ_URL,
  config.RABBITMQ_EXCHANGE,
  config.RABBITMQ_EXCHANGE_TYPE
);
