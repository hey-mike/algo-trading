import amqp from "amqplib";
import { config } from "../config"; // Ensure this points to your actual config file
import { info, error } from "../utils/logger";

class RabbitMQPublisher {
  private channel: amqp.Channel | null = null;
  private connection: amqp.Connection | null = null;
  private isConnected: boolean = false;

  constructor(
    private url: string = `amqp://${config.RABBITMQ_HOST}`,
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

      this.connection.on("close", () => {
        console.error("RabbitMQ connection closed. Attempting to reconnect...");
        this.isConnected = false;
        this.channel = null;
        this.connection = null;
        setTimeout(() => this.ensureConnection(), 1000); // Retry connection after a delay
      });

      this.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
        this.isConnected = false;
      });
    } catch (err) {
      info(`Connecting to RabbitMQ URL: ${this.url}`);
      console.error("Failed to connect to RabbitMQ:", err);
      setTimeout(() => this.ensureConnection(), 1000); // Retry connection after a delay
    }
  }

  public async publish(data: any): Promise<void> {
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
      console.info(
        `Published data to ${this.exchange} exchange with routing key ${routingKey}`
      );
    } catch (err) {
      console.error("Error publishing message:", err);
      throw err; // Re-throw to allow caller to handle the error
    }
  }
}

export const rabbitMQPublisher = new RabbitMQPublisher();
