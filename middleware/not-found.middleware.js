const httpErrors = require('http-errors');

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new httpErrors.NotFound(`${req.method} ${req.originalUrl}`);
  next(error);
};

module.exports = { notFoundMiddleware };
