import amqp, { Connection, Channel } from "amqplib";
import { config } from "../config";

let connection: Connection;
let channel: Channel;

export async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(config.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert the exchange and queue
    await channel.assertExchange(config.RABBITMQ_ORDER_EXCHANGE, "topic", {
      durable: false,
    });
    const { queue } = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(
      queue,
      config.RABBITMQ_ORDER_EXCHANGE,
      config.RABBITMQ_ORDER_STATUS_ROUTING_KEY
    );

    console.log(
      "Trading Bot Server connected to RabbitMQ",
      config.RABBITMQ_URL
    );

    // Return the channel for other modules to use
    return channel;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

export function getChannel() {
  return channel;
}

export async function closeRabbitMQConnection() {
  try {
    await channel.close();
    await connection.close();
    console.log("Disconnected from RabbitMQ");
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error);
  }
}
