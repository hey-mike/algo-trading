import winston from 'winston';


// Define Log Levels as an Enum for type safety and clarity
enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

const logger = winston.createLogger({
  level: 'info', // Set minimum log level (configurable if needed)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // Structured logs (optional)
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }), // Enable color for all logs
        winston.format.printf(({ level, message, label, timestamp }) => {
        //   const color = colors[log.level as LogLevel];
        //   const message = color ? color(log.message) : log.message; // Apply color based on level
        //   console.log()
        return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
});

// Improved log function to handle type mismatch and structured logs
export function log(level: LogLevel, message: string | object, meta?: any): void {
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
  logger.log(level, logMessage, meta);
}

// Optional helper functions for specific log levels (improves readability)
export function info(message: string | object, meta?: any): void {
  log(LogLevel.INFO, message, meta);
}

export function warn(message: string | object, meta?: any): void {
  log(LogLevel.WARN, message, meta);
}

export function error(message: string | object, meta?: any): void {
  log(LogLevel.ERROR, message, meta);
}
