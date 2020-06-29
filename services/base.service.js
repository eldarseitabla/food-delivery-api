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
   * @param {number} limit
   * @param {number} offset
   * @return {Promise<Array>}
   */
  async findAll (limit, offset) {
    return this._model.findAll(limit, offset);
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
