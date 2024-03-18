from fastapi import FastAPI
import threading
import asyncio
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

def start_consumer():
    connection = RabbitMQConnection.get_connection()
    consumer = RabbitMQConsumer(connection, "market_data_queue")
    try:
        consumer.consume(on_market_data_received)
    except Exception as e:
        logger.error(f"Error while consuming messages: {e}")
    finally:
        RabbitMQConnection.close_connection()


@app.on_event("startup")
async def startup_event():
    logger.info("Trading Strategy Service started")
    await database.connect()

    threading.Thread(target=start_consumer).start()
    logger.info("Started market data consumer thread.")


@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()
    RabbitMQConnection.close_connection()
    logger.info("Trading Strategy Service stopped")

app.include_router(router)