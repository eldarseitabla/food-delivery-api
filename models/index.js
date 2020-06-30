/**
 * @module model
 */
module.exports = {
  ...require('./restaurant.model'),
  ...require('./courier.model'),
  ...require('./product.model'),
  ...require('./customer.model'),
  ...require('./order.model'),
  ...require('./order-item.model'),
};
