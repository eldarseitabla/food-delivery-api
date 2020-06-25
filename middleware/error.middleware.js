const { getLogger } = require('log4js');

const logger = getLogger('[middleware.errorMiddleware]');

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const errorMiddleware = async (error, req, res, next) => {
  if (error) {
    const status = error.statusCode || 500;
    res.status(status);
    const message = { ...error };
    if (/* !config.error.emitStackTrace */ !(false)) { // eslint-disable-line
      delete message.stack;
    }
    if (error.status === 403 || error.status === 401) {
      logger.warn(error);
    } else {
      logger.error(error);
    }
    res.send(message);
  } else {
    next();
  }
};

module.exports = { errorMiddleware };
