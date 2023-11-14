import { createLogger, transports, format, Logger } from 'winston';
const logger: Logger = createLogger({
  level: 'info', // Set the log level as needed
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

export default logger;
