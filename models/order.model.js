const httpErrors = require('http-errors');
const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { customerModel } = require('./customer.model');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 * @extends BaseModel
 */
class OrderModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = 'order';
  }

  async _checkParent (id) {
    const result = await this._db(customerModel.table).where('id', id);
    if (!result[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a customer with such id: ${id}`);
    }
  }

  async create ({ customer_id, payment_status, status, address }) {
    await this._checkParent(customer_id);
    return super.create({ customer_id, payment_status, status, address });
  }

  async updateOne (id, { customer_id, payment_status, status, address }) {
    await this._checkParent(customer_id);
    return super.updateOne(id,{ customer_id, payment_status, status, address });
  }
}

/**
 * @type {module:model.OrderModel}
 */
OrderModel.prototype.OrderModel = OrderModel;

const orderModel = new OrderModel(mysqlClient);

module.exports = { orderModel };
