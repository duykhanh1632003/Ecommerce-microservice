import path from "path";
import winston from "winston";


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.resolve(__dirname, './error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.resolve(__dirname, './combined.log') }),
    ]
})

export default logger;
