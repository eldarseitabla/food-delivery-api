const { BaseModel } = require('./base.model');
const { mysqlClient } = require('../db');
const { mysqlTables } = require('../constants');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 */
class RestaurantModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = mysqlTables.restaurant;
  }
}

/**
 * @type {module:model.RestaurantModel}
 */
RestaurantModel.prototype.RestaurantModel = RestaurantModel;

const restaurantModel = new RestaurantModel(mysqlClient);

module.exports = { restaurantModel };
