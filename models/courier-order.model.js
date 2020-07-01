const httpErrors = require('http-errors');
const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { courierModel } = require('./courier.model');
const { orderModel } = require('./order.model');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 * @extends BaseModel
 */
class CourierOrderModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = 'courier_order';
  }

  async _checkParents (courier_id, order_id) {
    const courierResult = await this._db(courierModel.table).where('id', courier_id);
    if (!courierResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a ${courierModel.table} with such id: ${courier_id}`);
    }

    const orderResult = await this._db(orderModel.table).where('id', order_id);
    if (!orderResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a ${orderModel.table} with such id: ${order_id}`);
    }
  }

  async create ({ courier_id, order_id }) {
    await this._checkParents(courier_id, order_id);
    return super.create({ courier_id, order_id });
  }

  async updateOne (id, { courier_id, order_id }) {
    await this._checkParents(courier_id, order_id);
    return super.updateOne(id,{ courier_id, order_id });
  }
}

/**
 * @type {module:model.CourierOrderModel}
 */
CourierOrderModel.prototype.CourierOrderModel = CourierOrderModel;

const courierOrderModel = new CourierOrderModel(mysqlClient);

module.exports = { courierOrderModel };
