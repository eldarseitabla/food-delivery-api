const responseTime = require('response-time');
const { getLogger } = require('log4js');

const logger = getLogger('[middleware.performTimingMiddleware]');

/**
 * Perform timing middleware
 * @memberOf module:middleware
 * @return {responseTime}
 */
const performTimingMiddleware = () => {
  return responseTime( (req, res, time) => {
    // const stat = (req.method + req.url)
    //   .replace(/[:.]/g, '')
    //   .replace(/\//g, '_');
    if (process.env.NODE_ENV !== 'test') {
      logger.info(`${req.method} ${req.originalUrl} - ${time}ms`);
    }
  });
};

module.exports = { performTimingMiddleware };
