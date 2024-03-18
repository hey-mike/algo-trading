import aio_pika
from app.core.config import settings

class RabbitMQ:
    connection: aio_pika.Connection = None
    channel: aio_pika.Channel = None

rabbitmq = RabbitMQ()

async def connect():
    rabbitmq.connection = await aio_pika.connect(settings.RABBITMQ_URL)
    rabbitmq.channel = await rabbitmq.connection.channel()

async def disconnect():
    await rabbitmq.connection.close()

async def consume_market_data(process_market_data):
    exchange = await rabbitmq.channel.declare_exchange("market_data", aio_pika.ExchangeType.TOPIC)
    queue = await rabbitmq.channel.declare_queue("trading_strategy_service", exclusive=True)
    await queue.bind(exchange, routing_key="market_data.*")
    await queue.consume(process_market_data)

async def publish_trade_signal(trade_signal):
    exchange = await rabbitmq.channel.declare_exchange("trade_signals", aio_pika.ExchangeType.TOPIC)
    await exchange.publish(
        aio_pika.Message(body=trade_signal.json().encode()),
        routing_key=f"trade_signals.{trade_signal.symbol}"
    )