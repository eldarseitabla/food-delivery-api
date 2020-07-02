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
class OrderModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = mysqlTables.order;
  }

  async _checkParent (id) {
    const result = await this._db(mysqlTables.customer).where('id', id);
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

  async findOne (id) {
    const result = await this._db.select().from(this.table).leftJoin(mysqlTables.order_item,`${this.table}.id`,`${mysqlTables.order_item}.order_id`).where(`${this.table}.id`, id).options({ nestTables: true });
    const { order } = result[0];
    order['orderItems'] = [];
    result.forEach(item => {
      if (item.order_item.id) {
        order.orderItems.push(item.order_item);
      }
    });
    return order;
  }
}

/**
 * @type {module:model.OrderModel}
 */
OrderModel.prototype.OrderModel = OrderModel;

const orderModel = new OrderModel(mysqlClient);

module.exports = { orderModel };
