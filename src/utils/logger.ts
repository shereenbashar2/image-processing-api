import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info', // Set the log level as needed
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
