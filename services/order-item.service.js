const { BaseService } = require('./base.service');
const { orderItemModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class OrderItemService extends BaseService {
}

/**
 * @type {module:service.OrderItemService}
 */
OrderItemService.prototype.OrderItemService = OrderItemService;

const orderItemService = new OrderItemService(orderItemModel);

module.exports = { orderItemService };
