import pika, json
from app.core.config import settings

class RabbitMQPublisher:
    def __init__(self, amqp_url: str):
        self.amqp_url = amqp_url
        self.connection = pika.BlockingConnection(pika.URLParameters(self.amqp_url))
        self.channel = self.connection.channel()

    def publish_trade_signal(self, signal):
        self.channel.basic_publish(exchange='',
                                   routing_key='trade_signal',
                                   body=json.dumps(signal))

rabbitmq_publisher = RabbitMQPublisher(settings.RABBITMQ_URL)
