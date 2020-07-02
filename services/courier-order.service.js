const httpErrors = require('http-errors');
const { BaseService } = require('./base.service');
const { orderModel, courierModel, courierOrderModel } = require('../models');
const { config } = require('../config');
const { mysqlTables } = require('../constants');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class CourierOrderService extends BaseService {

  async _check (courier_id, order_id, orderResult) {
    const courierResult = await courierModel.findOne(courier_id);
    if (!courierResult) {
      throw new httpErrors.UnprocessableEntity(`Not a ${mysqlTables.courier} with such id: ${courier_id}`);
    }
    if (!orderResult) {
      throw new httpErrors.UnprocessableEntity(`Not a ${mysqlTables.order} with such id: ${order_id}`);
    }
    if (orderResult.payment_status === config.order.paymentStatus.notPaid) {
      throw new httpErrors.UnprocessableEntity(`Order ${orderResult.id} not paid`);
    }
  }

  async create ({ courier_id, order_id }) {
    const orderResult = await orderModel.findOne(order_id);
    await this._check(courier_id, order_id, orderResult);

    if (orderResult.status !== config.order.status.active) {
      console.log('ddd');
      throw new httpErrors.UnprocessableEntity(`Order ${orderResult.id} not active`);
    }

    await orderModel.updateOne(orderResult.id, { ...orderResult, status: config.order.status.inProgress });
    return super.create({ courier_id, order_id });
  }

  async updateOne (id, { courier_id, order_id, statusOrder }) {
    const orderResult = await orderModel.findOne(order_id);
    await this._check(courier_id, order_id, orderResult);
    await orderModel.updateOne(orderResult.id, { ...orderResult, status: statusOrder });
    return super.updateOne(id,{ courier_id, order_id });
  }
}

/**
 * @type {module:service.OrderItemService}
 */
CourierOrderService.prototype.CourierOrderService = CourierOrderService;

const courierOrderService = new CourierOrderService(courierOrderModel);

module.exports = { courierOrderService };
