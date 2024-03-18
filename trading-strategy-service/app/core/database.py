from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.DATABASE_URL)

    async def disconnect(self):
        self.client.close()

    def get_database(self):
        return self.client.get_default_database()

    def get_collection(self, collection_name: str):
        db = self.get_database()
        return db[collection_name]

database = Database()

async def get_strategy_collection():
    return database.get_collection("strategies")

async def get_market_data_collection():
    return database.get_collection("market_data")

async def get_trade_signal_collection():
    return database.get_collection("trade_signals")