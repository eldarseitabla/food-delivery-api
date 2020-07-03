const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { mysqlTables } = require('../constants');
const { config } = require('../config');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 * @extends BaseModel
 */
class CourierModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = mysqlTables.courier;
  }

  async findWhereDidHeGo (filter) {
    // SELECT o.address, COUNT(*) FROM courier c
    // JOIN courier_order co ON c.id = co.courier_id
    // JOIN `order` o ON o.id = co.order_id
    // GROUP BY o.address
    // ORDER BY 2 DESC;
    const where = filter.where;
    const orderBy = filter.order_by;
    const offset = filter.offset;
    const limit = filter.limit;
    return this._db
      .select(`${mysqlTables.order}.address`)
      .count('*')
      .from(this.table)
      .join(mysqlTables.courier_order,`${this.table}.id`,`${mysqlTables.courier_order}.courier_id`)
      .join(mysqlTables.order, `${mysqlTables.order}.id`, `${mysqlTables.courier_order}.order_id`)
      .where(`${this.table}.${where.field}`, where.operator, where.value)
      .groupBy(`${mysqlTables.order}.address`)
      .orderBy(2, orderBy.sort_direction)
      .limit(limit)
      .offset(offset);
  }

  async howManyOrdersCompleted (filter) {
    // SELECT COUNT(*) as count FROM courier c
    // JOIN courier_order co ON c.id = co.courier_id
    // JOIN `order` o ON o.id = co.order_id
    // WHERE o.status = 'done'
    const where = filter.where;
    const orderBy = filter.order_by;
    const offset = filter.offset;
    const limit = filter.limit;
    const result = await this._db(this.table)
      .count('*', { as: 'count' })
      .join(mysqlTables.courier_order,`${this.table}.id`,`${mysqlTables.courier_order}.courier_id`)
      .join(mysqlTables.order, `${mysqlTables.order}.id`, `${mysqlTables.courier_order}.order_id`)
      .where(`${mysqlTables.order}.status`, config.order.status.done)
      .where(`${this.table}.${where.field}`, where.operator, where.value)
      .orderBy(`${this.table}.${orderBy.field}`, orderBy.sort_direction)
      .limit(limit)
      .offset(offset);
    return result[0];
  }

  async howMuchDidCompleteOrders (filter) {
    // SELECT SUM(oi.price) FROM courier c
    // JOIN courier_order co ON c.id = co.courier_id
    // JOIN `order` o ON o.id = co.order_id
    // JOIN order_item oi ON oi.order_id = o.id
    // WHERE o.status = 'done';
    const where = filter.where;
    const orderBy = filter.order_by;
    const offset = filter.offset;
    const limit = filter.limit;
    const result = await this._db(this.table)
      .sum(`${mysqlTables.order_item}.price`, { as: 'amount' })
      .join(mysqlTables.courier_order,`${this.table}.id`,`${mysqlTables.courier_order}.courier_id`)
      .join(mysqlTables.order, `${mysqlTables.order}.id`, `${mysqlTables.courier_order}.order_id`)
      .join(mysqlTables.order_item, `${mysqlTables.order_item}.order_id`, `${mysqlTables.order}.id`)
      .where(`${mysqlTables.order}.status`, config.order.status.done)
      .where(`${this.table}.${where.field}`, where.operator, where.value)
      .orderBy(`${this.table}.${orderBy.field}`, orderBy.sort_direction)
      .limit(limit)
      .offset(offset);
    return result[0];
  }

  async averageDeliveryTime (filter) {
    // SELECT AVG( TIME_TO_SEC( TIMEDIFF(o.updated_at, o.created_at) ) ) AS time_average_sec FROM courier c
    // JOIN courier_order co ON c.id = co.courier_id
    // JOIN `order` o ON o.id = co.order_id
    // WHERE o.status = 'done';
    const where = filter.where;
    const orderBy = filter.order_by;
    const offset = filter.offset;
    const limit = filter.limit;
    const result = await this._db(this.table)
      .select(this._db.raw(`AVG( TIME_TO_SEC( TIMEDIFF( ${mysqlTables.order}.updated_at, ${mysqlTables.order}.created_at) ) ) as time_average_sec`))
      // .avg(this._db.raw(`TIME_TO_SEC( TIMEDIFF(${mysqlTables.order}.updated_at, ${mysqlTables.order}.created_at) ) as time_average_sec`))
      .join(mysqlTables.courier_order,`${this.table}.id`,`${mysqlTables.courier_order}.courier_id`)
      .join(mysqlTables.order, `${mysqlTables.order}.id`, `${mysqlTables.courier_order}.order_id`)
      .join(mysqlTables.order_item, `${mysqlTables.order_item}.order_id`, `${mysqlTables.order}.id`)
      .where(`${mysqlTables.order}.status`, config.order.status.done)
      .where(`${this.table}.${where.field}`, where.operator, where.value)
      .orderBy(`${this.table}.${orderBy.field}`, orderBy.sort_direction)
      .limit(limit)
      .offset(offset);
    return result[0];
  }
}

/**
 * @type {module:model.CourierModel}
 */
CourierModel.prototype.CourierModel = CourierModel;

const courierModel = new CourierModel(mysqlClient);

module.exports = { courierModel };
