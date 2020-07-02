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
}

/**
 * @type {module:model.CourierModel}
 */
CourierModel.prototype.CourierModel = CourierModel;

const courierModel = new CourierModel(mysqlClient);

module.exports = { courierModel };
