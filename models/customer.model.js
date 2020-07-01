const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 * @extends BaseModel
 */
class CustomerModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = 'customer';
  }
}

/**
 * @type {module:model.CustomerModel}
 */
CustomerModel.prototype.CustomerModel = CustomerModel;

const customerModel = new CustomerModel(mysqlClient);

module.exports = { customerModel };
