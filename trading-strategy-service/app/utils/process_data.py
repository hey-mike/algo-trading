# Assume the market data messages are JSON objects with at least the following structure:
# {
#   "symbol": "BTCUSD",
#   "price": 48000.0,
#   "timestamp": "2021-03-17T12:34:56"
# }

import json
from .logging import get_logger

logger = get_logger()

def on_market_data_received(ch, method, properties, body):
    """Callback function to process received market data."""
    try:
        data = json.loads(body)
        logger.info(f"Received market data: {data}")
        
        # Here you can process the data, such as analyzing it for trading signals,
        # updating a database, or sending it to another service/component for further processing.
        process_market_data(data)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode market data: {e}")
    except Exception as e:
        logger.error(f"Error processing market data: {e}")

def process_market_data(data):
    """Process and analyze the market data."""
    # Placeholder for your market data processing logic.
    # This might involve analyzing for trading signals, updating databases, etc.
    logger.info(f"Processing market data for symbol: {data['symbol']} at price: {data['price']}")
    # Add your analysis or processing logic here.

# Example usage with RabbitMQConsumer (Assuming RabbitMQConsumer is implemented as before)
# from app.core.rabbitmq_connection import RabbitMQConnection
# from app.rabbitmq.rabbitmq_consumer import RabbitMQConsumer

# connection = RabbitMQConnection.get_connection()
# consumer = RabbitMQConsumer(connection, "market_data_queue")
# consumer.consume(on_market_data_received)
