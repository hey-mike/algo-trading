from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings
from app.core.database import database
from app.core.rabbitmq import rabbitmq
from app.utils.logging import get_logger

logger = get_logger()

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup_event():
    await database.connect()
    await rabbitmq.connect()
    logger.info("Trading Strategy Service started")

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()
    await rabbitmq.disconnect()
    logger.info("Trading Strategy Service stopped")

app.include_router(router)