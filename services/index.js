/**
 * @module service
 */
module.exports = {
  ...require('./restaurant.service'),
  ...require('./courier.service'),
  ...require('./product.service'),
  ...require('./customer.service'),
  ...require('./order.service'),
  ...require('./order-item.service'),
};
