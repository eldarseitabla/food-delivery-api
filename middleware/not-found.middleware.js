const httpErrors = require('http-errors');

/**
 * Not found handler middleware.
 * @memberOf module:middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<void>}
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new httpErrors.NotFound(`${req.method} ${req.originalUrl}`);
  next(error);
};

module.exports = { notFoundMiddleware };
