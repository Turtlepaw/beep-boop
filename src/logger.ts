import pino from 'pino';
const transport = pino.transport({
    target: 'pino/file',
    options: { destination: './log.json' },
});
const logger = pino(transport);
export const Logger = logger;