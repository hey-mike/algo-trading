# Crypto Trading Bot Project

## Overview

The Crypto Trading Bot Project is a comprehensive system designed to automate trading strategies across various cryptocurrency exchanges. It leverages real-time market data to execute trades based on predefined algorithms and strategies, aiming to maximize profits and minimize risks. The system is built on a microservices architecture, facilitating scalability, modularity, and maintainability.

## Architecture

- Trading Bot Server: The central server that handles user interactions, strategy management, and orchestrates communication between components.
- Trading Strategy Service: A FastAPI-based service for managing and executing trading strategies.
- Data Acquisition Service: Collects real-time and historical market data from exchanges.
- Order Execution Service: Executes trades on exchanges based on signals from the Trading Strategy Service.
- RabbitMQ: Facilitates message passing between services for decoupled communication.
- WebSocket Service: Provides real-time updates to clients about market conditions and trade executions.

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js (for the Trading Bot Server and WebSocket Service)
- RabbitMQ
- Docker (optional for containerization)

## Running the Services

```bash
chmod +x start-dev.sh
./start-dev.sh
```

## Usage

- Trading Bot Server: Interact with the server through its REST API or WebSocket connection to manage trading strategies, view market data, and monitor trading activities.
- Trading Strategy Service: Define and adjust trading strategies via its FastAPI endpoints.
- Data Acquisition Service: Automatically fetches and processes market data without direct user interaction.
- Order Execution Service: Listens for trade signals and executes trades accordingly.

## Contributing

We welcome contributions to the Crypto Trading Bot Project! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes.
4.  Push to the branch.
5.  Submit a pull request.

## License

MIT
