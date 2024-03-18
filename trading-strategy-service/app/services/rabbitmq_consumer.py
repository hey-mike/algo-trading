# rabbitmq_consumer.py
from pika.exceptions import AMQPError, ChannelClosedByBroker
from app.utils.logging import get_logger
from app.core.rabbitmq_connection import RabbitMQConnection

class RabbitMQConsumer:
    def __init__(self, connection, queue_name):
        self.logger = get_logger()
        self.connection = connection
        self.queue_name = queue_name
        self.channel = None
        self.ensure_channel()

    def ensure_channel(self):
        if not self.channel or self.channel.is_closed:
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue=self.queue_name, durable=True)

    def consume(self, callback):
        self.ensure_channel()  # Ensure channel is open and valid
        try:
            self.channel.basic_consume(queue=self.queue_name,
                                       on_message_callback=callback,
                                       auto_ack=True)
            self.logger.info(f"Started consuming messages from {self.queue_name}.")
            self.channel.start_consuming()
        except (AMQPError, ChannelClosedByBroker) as e:
            self.logger.error(f"Failed to consume messages: {e}")
            # Implement reconnection or alternative error handling here

    def stop_consuming(self):
        if self.channel and self.channel.is_open:
            self.channel.stop_consuming()
            self.logger.info("Stopped consuming messages.")
