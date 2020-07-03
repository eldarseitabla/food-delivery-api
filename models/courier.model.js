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
}

/**
 * @type {module:model.CourierModel}
 */
CourierModel.prototype.CourierModel = CourierModel;

const courierModel = new CourierModel(mysqlClient);

module.exports = { courierModel };
