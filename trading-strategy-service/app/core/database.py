from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.DATABASE_URL)

    async def disconnect(self):
        self.client.close()

    def get_strategy_collection(self):
        return self.client.trading_bot.strategies

database = Database()