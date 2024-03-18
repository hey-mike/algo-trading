from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Trading Strategy Service"
    DATABASE_URL: str = "mongodb://localhost:27017"
    RABBITMQ_URL: str = "amqp://guest:guest@localhost"

settings = Settings()