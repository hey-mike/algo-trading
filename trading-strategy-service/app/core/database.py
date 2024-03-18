from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

database = Database()

async def get_database() -> AsyncIOMotorClient:
    return database.client

async def connect():
    database.client = AsyncIOMotorClient(settings.DATABASE_URL)

async def disconnect():
    database.client.close()

def get_strategy_collection():
    return database.client.trading_bot.strategies