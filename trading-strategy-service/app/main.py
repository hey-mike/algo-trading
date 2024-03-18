from fastapi import FastAPI
import threading
from app.api.routes import router
from app.core.config import settings
from app.core.database import database
# from app.core.rabbitmq import rabbitmq
from app.utils.logging import get_logger
from app.utils.process_data import on_market_data_received
from app.services.rabbitmq_consumer import RabbitMQConsumer
from app.core.rabbitmq_connection import RabbitMQConnection

logger = get_logger()

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup_event():
    logger.info("Trading Strategy Service started")
    await database.connect()

    connection = RabbitMQConnection.get_connection()  # Ensure connection is established
    consumer = RabbitMQConsumer(connection, "market_data_queue")  # Specify the correct queue name
    # Start consuming in a non-blocking way
    # threading.Thread(target=consumer.consume, args=(on_market_data_received,)).start()
    consumer.consume(on_market_data_received)
    logger.info("Started market data consumer thread.")


@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()
    RabbitMQConnection.close_connection()
    logger.info("Trading Strategy Service stopped")

app.include_router(router)