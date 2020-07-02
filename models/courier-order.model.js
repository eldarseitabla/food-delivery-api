const httpErrors = require('http-errors');
const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { mysqlTables } = require('../constants');

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
    this.table = mysqlTables.courier_order;
  }

  async _checkParents (courier_id, order_id) {
    const courierResult = await this._db(mysqlTables.courier).where('id', courier_id);
    if (!courierResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a ${mysqlTables.courier} with such id: ${courier_id}`);
    }

    const orderResult = await this._db(mysqlTables.order).where('id', order_id);
    if (!orderResult[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a ${mysqlTables.order} with such id: ${order_id}`);
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
