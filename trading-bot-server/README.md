# Trading Bot Server

The Trading Bot Server is a key component of the crypto trading bot system, serving as the communication hub between the client application and various microservices. It provides RESTful APIs for data retrieval, strategy management, and user authentication.

## Features

- Acts as a proxy for retrieving real-time and historical market data from the data acquisition service.
- Manages trading strategies by forwarding strategy-related requests to the trading strategy service.
- Authenticates users using JSON Web Tokens (JWTs) and handles user registration and login.
- Implements security measures such as CORS, rate limiting, and secure communication using HTTPS.
- Connects to RabbitMQ for asynchronous communication with other microservices.

## Prerequisites

- Node.js (version 12 or above)
- npm (Node Package Manager)
- RabbitMQ server
- Data acquisition service (running separately)
- Trading strategy service (running separately)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/trading-bot-server.git
```

2. Navigate to the project directory:

```bash
cd trading-bot-server
```

3. Install the dependencies:

```bash
npm install
```

4. Create a .env file in the project root and provide the necessary configuration:

```bash
PORT=5003
JWT_SECRET=your-secret-key
DATA_ACQUISITION_SERVICE_URL=http://localhost:5000
TRADING_STRATEGY_SERVICE_URL=http://localhost:5001
RABBITMQ_URL=amqp://localhost
ORDER_STATUS_EXCHANGE=order_status_exchange
ORDER_STATUS_ROUTING_KEY=order.status.*
```

5. Build the TypeScript code:

```bash
npm run build
```

## Usage

1.  Start the server

```bash
npm start
```

The server will start running on the specified port (default: 5003). 2. Use a REST client (e.g., cURL, Postman) or the client application to make requests to the server endpoints. 3. Refer to the API documentation for detailed information on request and response formats.

    - /api/data/real-time/:symbol (GET): Retrieve real-time market data for a specific trading pair.
    - /api/data/historical/:symbol (GET): Retrieve historical market data for a specific trading pair.
    - /api/strategies (POST): Create a new trading strategy.
    - /api/strategies/:id (PUT): Update an existing trading strategy.
    - /api/auth/login (POST): Authenticate user and obtain a JWT token.
    - /api/auth/register (POST): Register a new user.

## Configuration

The server configuration is stored in the config.ts file. You can modify the configuration options such as the server port, JWT secret, rate limiter settings, and microservice URLs.

Make sure to update the .env file with the appropriate values for your environment.

## Error Handling

The server implements centralized error handling using the errorHandler middleware. Errors occurring during request processing are caught and logged, and appropriate error responses are sent to the client.

## Authentication

The server uses JSON Web Tokens (JWTs) for user authentication. Certain routes are protected and require a valid JWT token to be included in the Authorization header of the request.

To obtain a JWT token, clients need to send a POST request to the /api/auth/login endpoint with valid user credentials. Upon successful authentication, a JWT token is returned, which should be included in subsequent requests to protected routes.

## Logging

The server logs errors and important events using the console object. You can enhance the logging mechanism by integrating a logging library or service for more advanced logging and monitoring capabilities.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License
