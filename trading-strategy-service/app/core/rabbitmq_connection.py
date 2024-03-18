# rabbitmq_connection.py
import pika
from pika.exceptions import AMQPError, AMQPConnectionError
import time
import random
from app.core.config import settings
from app.utils.logging import get_logger

logger = get_logger()


def exponential_backoff_with_jitter(attempt, max_delay=32):
    """Calculate the delay with exponential backoff and jitter."""
    # Exponential backoff
    delay = min(max_delay, (2 ** attempt))
    # Apply jitter by randomizing the delay
    jitter = random.uniform(0, delay)
    return jitter

""" Usage
# Get the shared connection
connection = RabbitMQConnection.get_connection()

# Initialize the publisher and consumer with the shared connection
publisher = RabbitMQPublisher(connection)
consumer = RabbitMQConsumer(connection, "your_queue_name")
"""
class RabbitMQConnection:
    _connection = None

    @classmethod
    def get_connection(cls):
        if cls._connection is None or not cls._connection.is_open:
            cls._attempt_connection()
        return cls._connection

    @classmethod
    def _attempt_connection(cls, max_attempts=5):
        """Attempt to connect to RabbitMQ with exponential backoff."""
        for attempt in range(max_attempts):
            try:
                cls._connection = pika.BlockingConnection(pika.URLParameters(settings.RABBITMQ_URL))
                logger.info("RabbitMQ connection established.")
                break  # Exit the loop if connection is successful
            except AMQPConnectionError as error:
                logger.error(f"Failed to connect to RabbitMQ: {error}")
                logger.error(f"Connection to url: {settings.RABBITMQ_URL}")
                if attempt < max_attempts - 1:  # Avoid sleeping on the last attempt
                    sleep_time = exponential_backoff_with_jitter(attempt)
                    logger.info(f"Retrying in {sleep_time:.2f} seconds...")
                    time.sleep(sleep_time)
                else:
                    logger.error("Maximum connection attempts reached. Giving up.")
                    cls._connection = None
                    raise  # Re-raise the last exception or a custom exception

    @classmethod
    def close_connection(cls):
        if cls._connection and cls._connection.is_open:
            cls._connection.close()
            logger.info("RabbitMQ connection closed.")