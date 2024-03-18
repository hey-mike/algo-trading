import amqp, { Connection, Channel } from "amqplib";
import { config } from "../config"; // Ensure this points to your actual config file
import { info, warn, error } from "../utils/logger";
import { MarketData } from "../types/MarketData";

class RabbitMQPublisher {
  private channel: amqp.Channel | null = null;
  private connection: amqp.Connection | null = null;
  private isConnecting: boolean = false;
  private connectionAttempts: number = 0;

  constructor(
    private url: string = config.RABBITMQ_URL,
    private exchange: string = "market_data",
    private exchangeType: string = "topic"
  ) {
    // this.ensureConnection();
  }
  private async handleError(message: string): Promise<void> {
    error(message);
    this.channel = null;
    this.connection = null;
    this.isConnecting = false;
    await this.reconnectWithBackoff();
  }

  private async ensureConnection(): Promise<void> {
    // If a connection attempt is already scheduled, do not schedule another
    if (this.connection && this.channel) return;
    if (this.isConnecting) return;

    try {
      this.isConnecting = true;
      this.connection = await amqp.connect(this.url);
      info("RabbitMQ connection is on.");

      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, this.exchangeType, {
        durable: false,
      });
      // Reset connection attempts upon successful connection
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
      this.handleError(`Failed to connect to RabbitMQ to ${this.url}: ${err}`);
    } finally {
      this.isConnecting = false;
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
    info("RabbitMQ connection closed.");
  }

  /**
   * implements a debounced reconnection strategy using exponential backoff,
   * minimizing the impact of flapping connections and reducing load on the RabbitMQ server.
   **/
  private reconnectWithBackoff(): void {
    if (this.connectionAttempts >= 5) {
      console.error("Maximum connection attempts reached. Giving up.");
      return;
    }

    const backoffTime = Math.pow(2, this.connectionAttempts) * 1000; // exponential backoff
    this.connectionAttempts++;

    setTimeout(() => {
      warn(
        `Attempting to reconnect to RabbitMQ. Attempt ${this.connectionAttempts}`
      );
      this.ensureConnection();
    }, backoffTime);
  }

  public async publish(data: MarketData): Promise<void> {
    await this.ensureConnection();

    if (!this.channel) {
      throw new Error("Unable to publish message: Channel is not available.");
    }

    try {
      const routingKey = `${this.exchange}.${data.symbol}`;
      this.channel.publish(
        this.exchange,
        routingKey,
        Buffer.from(JSON.stringify(data)),
        {
          persistent: true,
        }
      );
      // info(
      //   `Published data to ${
      //     this.exchange
      //   } exchange with routing key ${routingKey} ${Buffer.from(
      //     JSON.stringify(data)
      //   )}`
      // );
    } catch (err) {
      error("Error publishing message:", err);
      throw err; // Re-throw to allow caller to handle the error
    }
  }
}

export const rabbitMQPublisher = new RabbitMQPublisher();
