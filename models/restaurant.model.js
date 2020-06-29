const { promisify } = require('util');
const { mysqlDb } = require('../db');

// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 */
class RestaurantModel {

  /** @param {Connection} mysqlDb */
  constructor (mysqlDb) {

    /** @type {string}
     * @private */
    this._table = 'restaurant';

    this._asyncDbQuery = promisify(mysqlDb.query.bind(mysqlDb));
  }

  async create ({ name, picture }) {
    const result = await this._asyncDbQuery(`INSERT INTO ${this._table} (name, picture) VALUES (?, ?)`, [name, picture]);
    const rows = await this.findOne(result.insertId);
    return rows[0];
  }

  async updateOne (id, { name, picture }) {
    await this._asyncDbQuery(`UPDATE ${this._table} SET name = ?, picture = ? WHERE id = ?`, [name, picture, id]);
    const rows = await this.findOne(id);
    return rows[0];
  }

  async findOne (id) {
    return this._asyncDbQuery(`SELECT * FROM ${this._table} WHERE id = ?`, [id]);
  }

  async findAll (limit, offset) {
    return this._asyncDbQuery(`SELECT * FROM ${this._table} LIMIT ${limit} OFFSET ${offset}`);
  }

  async deleteOne (id) {
    return this._asyncDbQuery(`DELETE FROM ${this._table} WHERE id = ?`, [id]);
  }

  async deleteAll () {
    return this._asyncDbQuery(`DELETE FROM ${this._table}`);
  }
}

const restaurantModel = new RestaurantModel(mysqlDb);

module.exports = { restaurantModel };
