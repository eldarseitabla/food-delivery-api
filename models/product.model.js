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
class ProductModel extends BaseModel {

  /** @param {knex.Client} mysqlClient */
  constructor (mysqlClient) {
    super(mysqlClient);

    /**
     * @type {string}
     */
    this.table = mysqlTables.product;
  }

  async _checkParent (id) {
    const result = await this._db(mysqlTables.restaurant).where('id', id);
    if (!result[0]) {
      throw new httpErrors.UnprocessableEntity(`Not a restaurant with such id: ${id}`);
    }
  }

  async create ({ name, price, description, picture, restaurant_id }) {
    await this._checkParent(restaurant_id);
    return super.create({ name, price, description, picture, restaurant_id });
  }

  async updateOne (id, { name, price, description, picture, restaurant_id }) {
    await this._checkParent(restaurant_id);
    return super.updateOne(id,{ name, price, description, picture, restaurant_id });
  }
}

/**
 * @type {module:model.ProductModel}
 */
ProductModel.prototype.ProductModel = ProductModel;

const productModel = new ProductModel(mysqlClient);

module.exports = { productModel };
