/**
 * @module validator
 */
module.exports = {
  ...require('./restaurant.validator'),
  ...require('./courier.validator'),
  ...require('./product.validator'),
  ...require('./customer.validator'),
  ...require('./order.validator'),
  ...require('./order-item.validator'),
};
