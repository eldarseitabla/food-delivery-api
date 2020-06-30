const { BaseService } = require('./base.service');
const { orderModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class OrderService extends BaseService {
}

/**
 * @type {module:service.OrderService}
 */
OrderService.prototype.OrderService = OrderService;

const orderService = new OrderService(orderModel);

module.exports = { orderService };
