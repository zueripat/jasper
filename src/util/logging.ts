import winston from 'winston';

interface Metadata {
    type: 'command' | 'event' | 'discord' | 'other';
    name: string;
    targetId?: string;
}

export const logger = {
    child: (metadata: Metadata) => {
        return productionLogger.child(metadata);
    },
};

// Winston instance for logging in production
const productionLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
        winston.format.printf(({ level, message, timestamp, metadata }) => {
            const metaString = `${metadata.type}/${metadata.name}:( ${metadata.targetId || 'No ID'} )`;
            return `[ ${timestamp} ] [ ${level.toUpperCase()} ] [ ${metaString} ] ${message}`;
        }),
    ),
    defaultMeta: { type: 'other', name: 'bot' } as Metadata,
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Winston instance for logging in development
if (process.env.NODE_ENV !== 'production') {
    productionLogger.add(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[ ${timestamp} ] [ ${level.toUpperCase()} ] ${message}`;
                }),
            ),
        }),
    );
}
