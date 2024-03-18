from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings
from app.core.database import database
from app.core.rabbitmq import rabbitmq

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup_event():
    await database.connect()
    await rabbitmq.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()
    await rabbitmq.disconnect()

app.include_router(router)