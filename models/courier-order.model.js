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
}

/**
 * @type {module:model.CourierOrderModel}
 */
CourierOrderModel.prototype.CourierOrderModel = CourierOrderModel;

const courierOrderModel = new CourierOrderModel(mysqlClient);

module.exports = { courierOrderModel };
