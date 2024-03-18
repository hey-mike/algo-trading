from pydantic import Field
from pydantic_settings import BaseSettings

# Rest of your code in config.py
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file (optional)
class Settings(BaseSettings):
    PROJECT_NAME: str = Field(default="Trading Strategy Service", env="PROJECT_NAME")
    DATABASE_URL: str = Field(default="mongodb://localhost:27017", env="DATABASE_URL")
    RABBITMQ_URL: str = Field(default="amqp://guest:guest@localhost", env="RABBITMQ_URL")

    class Config:
        env_prefix = "TSS_"

settings = Settings()