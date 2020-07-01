const { BaseService } = require('./base.service');
const { courierOrderModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class CourierOrderService extends BaseService {
}

/**
 * @type {module:service.OrderItemService}
 */
CourierOrderService.prototype.CourierOrderService = CourierOrderService;

const courierOrderService = new CourierOrderService(courierOrderModel);

module.exports = { courierOrderService };
