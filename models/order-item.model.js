const httpErrors = require('http-errors');
const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { productModel } = require('./product.model');
const { orderModel } = require('./order.model');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 * @extends BaseModel
 */
class OrderItemModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = 'order_item';
  }

  async _checkParents (order_id, product_id) {
    const orderResult = await this._db(orderModel.table).where('id', order_id);
    if (!orderResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a order with such id: ${order_id}`);
    }

    const productResult = await this._db(productModel.table).where('id', product_id);
    if (!productResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a restaurant with such id: ${product_id}`);
    }
  }

  async create ({ order_id, product_id, price }) {
    await this._checkParents(order_id, product_id);
    return super.create({ order_id, product_id, price });
  }

  async updateOne (id, { order_id, product_id, price }) {
    await this._checkParents(order_id, product_id);
    return super.updateOne(id,{ order_id, product_id, price });
  }
}

/**
 * @type {module:model.OrderItemModel}
 */
OrderItemModel.prototype.OrderItemModel = OrderItemModel;

const orderItemModel = new OrderItemModel(mysqlClient);

module.exports = { orderItemModel };
