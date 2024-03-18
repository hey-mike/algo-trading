# rabbitmq_publisher.py
import json
from pika.exceptions import AMQPError
from app.utils.logging import get_logger
from app.core.rabbitmq_connection import RabbitMQConnection

class RabbitMQPublisher:
    def __init__(self, connection):
        self.logger = get_logger()
        self.connection = connection
        self.channel = None
        self.ensure_channel()

    def ensure_channel(self):
        if not self.channel or self.channel.is_closed:
            self.channel = self.connection.channel()

    def publish_trade_signal(self, signal):
        self.ensure_channel()  # Ensure channel is open and valid
        try:
            self.channel.basic_publish(exchange='',
                                       routing_key='trade_signal',
                                       body=json.dumps(signal))
            self.logger.info("Published trade signal to RabbitMQ.")
        except AMQPError as e:
            self.logger.error(f"Failed to publish message: {e}")
            # Implement retry or alternative handling here
