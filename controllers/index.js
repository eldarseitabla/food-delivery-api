/**
 * @module controller
 */
module.exports = {
  ...require('./restaurant.controller'),
  ...require('./courier.controller'),
  ...require('./product.controller'),
  ...require('./customer.controller'),
  ...require('./order.controller'),
  ...require('./order-item.controller'),
};
