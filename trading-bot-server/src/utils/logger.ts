import winston, { Logger, format } from "winston";

// Define Log Levels as an Enum for type safety and clarity
enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

// Create a custom Winston logger instance
const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "my-service" },
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          const metaData = Object.keys(meta).length ? JSON.stringify(meta) : "";
          return `${timestamp} [${level}]: ${message} ${metaData}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: LogLevel.ERROR,
    }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
const customLogger = {
  ...logger,
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, meta?: any) => logger.error(message, meta),
};

export default customLogger;
