/**
 * @module validator
 */
module.exports = {
  ...require('./restaurant.validator'),
  ...require('./courier.validator'),
  ...require('./common.validator'),
};
