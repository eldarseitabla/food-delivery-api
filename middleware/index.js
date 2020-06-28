/**
 * @module middleware
 */
module.exports = {
  ...require('./error.middleware'),
  ...require('./perform-timing-middleware'),
  ...require('./not-found.middleware'),
};
