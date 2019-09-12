/*
 ** When importing the logger the module name should be add to the logger
 ** Example import:
 ** const logger = require('./logger')('server.js');
 ** 'server.js' been the file where the logger is been imported into.
 */

const { createLogger, format, transports } = require('winston');

const messageFormat = format.printf(
  ({ level, label, message, timestamp }) => `${timestamp}: ${label} - ${level}: ${message}`
);

module.exports = function(fileName) {
  const defaultConsoleFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.label({ label: fileName }),
    messageFormat
  );

  const options = {
    info: {
      console: {
        level: 'info',
        handleExceptions: true,
        format: defaultConsoleFormat
      }
    },
    debug: {
      console: {
        level: 'debug',
        handleExceptions: true,
        format: defaultConsoleFormat
      },
      file: {
        filename: 'dev-debug.log',
        level: 'debug',
        handleExceptions: true,
        format: format.combine(format.timestamp(), format.label({ label: fileName }), messageFormat)
      }
    }
  };

  const logger = createLogger();

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(options.debug.console));
    if (process.env.NODE_ENV === 'development') {
      logger.add(new transports.File(options.debug.file)); // creates local dev-debug.log file
    }
  } else {
    logger.add(new transports.Console(options.info.console));
  }

  return logger;
};
