import winston, { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';

/**
 * https://stackoverflow.com/a/41407246
 * Log level escpace codes
 */
const levelStyleMap: { [key: string]: string } = {
  emerg: '\x1b[41m%s\x1b[0m',
  alert: '\x1b[41m%s\x1b[0m',
  crit: '\x1b[41m%s\x1b[0m',
  error: '\x1b[33m%s\x1b[0m',
  warning: '\x1b[94m%s\x1b[0m',
  notice: '\x1b[35m%s\x1b[0m',
  info: '\x1b[32m%s\x1b[0m',
  debug: '\x1b[36m%s\x1b[0m'
};

class ColoredConsoleTransport extends Transport {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(info: any, callback: { (): void }) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain,@typescript-eslint/no-non-null-assertion
    const label = info.consoleLoggerOptions?.label! || (info.level as string).toUpperCase();
    const finalMessage = `[${new Date().toISOString()}] [${label}] ${info.message}`;

    console.log(levelStyleMap[info.level], finalMessage);
    info.stack && console.log('\t', info.stack);
    callback();
  }
}

const logTransports = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack
          };
        }
        return value;
      }
    })
  }),
  new ColoredConsoleTransport()
];

export type Logger = Pick<winston.Logger, 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'crit' | 'emerg'>;

export const logger: Logger = createLogger({
  levels: winston.config.syslog.levels,
  format: format.combine(
    format.timestamp()
  ),
  transports: logTransports,
  defaultMeta: { service: 'api' },
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});
