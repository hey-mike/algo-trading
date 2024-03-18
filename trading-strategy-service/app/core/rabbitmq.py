import aio_pika
from app.core.config import settings
from app.utils.logging import get_logger

logger = get_logger()

class RabbitMQ:
    connection: aio_pika.Connection = None
    channel: aio_pika.Channel = None

    async def connect(self):
        self.connection = await aio_pika.connect(settings.RABBITMQ_URL)
        self.channel = await self.connection.channel()
        logger.info("Connected to RabbitMQ")

    async def disconnect(self):
        await self.connection.close()
        logger.info("Disconnected from RabbitMQ")

    async def consume_market_data(self, process_market_data):
        exchange = await self.channel.declare_exchange("market_data", aio_pika.ExchangeType.TOPIC)
        queue = await self.channel.declare_queue("trading_strategy_service", exclusive=True)
        await queue.bind(exchange, routing_key="market_data.*")
        logger.info("Started consuming market data")
        await queue.consume(process_market_data)

    async def publish_trade_signal(self, trade_signal):
        exchange = await self.channel.declare_exchange("trade_signals", aio_pika.ExchangeType.TOPIC)
        await exchange.publish(
            aio_pika.Message(body=trade_signal.json().encode()),
            routing_key=f"trade_signals.{trade_signal.symbol}"
        )
        logger.info(f"Published trade signal for symbol: {trade_signal.symbol}")

rabbitmq = RabbitMQ()