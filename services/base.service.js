const httpErrors = require('http-errors');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class BaseService {
  /** @param {module:model.BaseModel} model */
  constructor (model) {

    /** @type {module:model.BaseModel}
     * @private */
    this._model = model;
  }

  /**
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async create (data) {
    return this._model.create(data);
  }

  /**
   * @param {number} id
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async updateOne (id, data) {
    const res = await this._model.findOne(id);
    if (!res) {
      throw new httpErrors.NotFound('Entity not found');
    }
    return this._model.updateOne(id, data);
  }

  /**
   * @param {number} id
   * @return {Promise<Object>}
   */
  async findOne (id) {
    return this._model.findOne(id);
  }

  /**
   * @param {string} filter.where.field
   * @param {string} filter.where.operator
   * @param {number|string} filter.where.value
   * @param {string} filter.order_by.sort_direction ASC | DESC
   * @param {string} filter.order_by.field Column name
   * @param {number} filter.limit
   * @param {number} filter.offset
   * @return {Promise<Array>}
   */
  async find (filter) {
    return this._model.find(filter);
  }

  /**
   * @param {number} id
   * @return {Promise<*>}
   */
  async deleteOne (id) {
    return this._model.deleteOne(id);
  }

  /**
   * @return {Promise<*>}
   */
  async deleteAll () {
    return this._model.deleteAll();
  }
}

module.exports = { BaseService };
