const httpErrors = require('http-errors');
const { BaseService } = require('./base.service');
const { orderModel, orderItemModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class OrderService extends BaseService {
  constructor (model) {
    super(model);
  }

  /**
   * @param {number} customer_id
   * @param {string} payment_status
   * @param {string} status
   * @param {string} address
   * @param {Array} orderItems
   * @return {Promise<Object>}
   */
  async create ({ customer_id, payment_status, status, address, orderItems }) {
    const orderCreated = await this._model.create({ customer_id, payment_status, status, address });
    if (orderItems && Array.isArray(orderItems)) {
      await Promise.all(orderItems.map(item => orderItemModel.create({
        order_id: orderCreated.id,
        product_id: item.product_id,
        price: item.price,
      })));
      return this._model.findOne(orderCreated.id);
    }
    return orderCreated;
  }

  /**
   * @param {number} id
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async updateOne (id, { customer_id, payment_status, status, address, orderItems }) {
    const res = await this._model.findOne(id);
    if (!res) {
      throw new httpErrors.NotFound('Entity not found');
    }
    if (orderItems && Array.isArray(orderItems)) {
      await Promise.all(orderItems.map(item => orderItemModel.updateOne(item.id, item)));
    }
    return this._model.updateOne(id, { customer_id, payment_status, status, address });
  }
}

/**
 * @type {module:service.OrderService}
 */
OrderService.prototype.OrderService = OrderService;

const orderService = new OrderService(orderModel);

module.exports = { orderService };
