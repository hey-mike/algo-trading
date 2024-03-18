import amqp, { Connection, Channel } from "amqplib";
import { config } from "../config"; // Ensure this points to your actual config file
import { info, warn, error } from "../utils/logger";
import { delay } from "../utils/helps";

import { MarketData } from "../types/MarketData";

class RabbitMQPublisher {
  private static instance: RabbitMQPublisher;
  private channel: Channel | null = null;
  private connection: Connection | null = null;
  private isConnecting: boolean = false;
  private connectionAttempts: number = 0;

  private constructor(
    private url: string = config.RABBITMQ_URL,
    private exchange: string = "market_data",
    private exchangeType: string = "topic"
  ) {}

  private async handleError(message: string): Promise<void> {
    error(message);
    this.channel = null;
    this.connection = null;
    this.isConnecting = false;
    await this.reconnectWithBackoff();
  }

  public static getInstance(): RabbitMQPublisher {
    if (!this.instance) {
      this.instance = new RabbitMQPublisher();
    }
    return this.instance;
  }
  public async isReady(): Promise<boolean> {
    return this.connection !== null && this.channel !== null;
  }

  public async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) return;
    if (this.isConnecting) return;

    this.isConnecting = true;
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, this.exchangeType, {
        durable: false,
      });
      info("Connected to RabbitMQ successfully");
      this.connectionAttempts = 0;
      this.connection.on("close", () =>
        this.handleError(
          "RabbitMQ connection closed. Attempting to reconnect..."
        )
      );
      this.connection.on("error", (err) =>
        this.handleError(`RabbitMQ connection error: ${err.message}`)
      );
    } catch (err: any) {
      await this.handleError(`Failed to connect to RabbitMQ: ${err.message}`);
    } finally {
      this.isConnecting = false;
    }
  }

  private async reconnectWithBackoff(): Promise<void> {
    const maxAttempts = 5;
    if (this.connectionAttempts >= maxAttempts) {
      console.error("Maximum connection attempts reached. Giving up.");
      return;
    }

    const backoffTime = Math.pow(2, this.connectionAttempts) * 1000;
    this.connectionAttempts++;
    await delay(backoffTime); // Await the delay

    warn(
      `Attempting to reconnect to RabbitMQ. Attempt ${this.connectionAttempts}`
    );
    this.ensureConnection();
  }

  public async publish(data: MarketData): Promise<void> {
    await this.ensureConnection();

    if (!this.channel)
      throw new Error("Unable to publish message: Channel is not available.");

    const routingKey = `${this.exchange}.${data.symbol}`;
    try {
      this.channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
      );
    } catch (err: any) {
      error(`Error publishing message: ${err.message}`);
      throw err;
    }
  }

  public async shutdown(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    info("RabbitMQ connection closed.");
  }
}

export const rabbitMQPublisher = RabbitMQPublisher.getInstance();
