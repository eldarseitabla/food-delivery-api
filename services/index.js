/**
 * @module service
 */
module.exports = {
  ...require('./restaurant.service'),
  ...require('./courier.service'),
  ...require('./product.service'),
  ...require('./customer.service'),
};
