const { restaurantModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class RestaurantService {

  /** @param {module:model#RestaurantModel} restaurantModel */
  constructor (restaurantModel) {

    /** @type {module:model#RestaurantModel}
     * @private */
    this._model = restaurantModel;
  }

  async create ({ name, picture }) {
    return this._model.create({ name, picture });
  }

  async updateOne (id, { name, picture }) {
    return this._model.updateOne(id, { name, picture });
  }

  async findOne (id) {
    return this._model.findOne(id);
  }

  async findAll (limit, offset) {
    return this._model.findAll(limit, offset);
  }

  async deleteOne (id) {
    return this._model.deleteOne(id);
  }

  async deleteAll () {
    return this._model.deleteAll();
  }
}

const restaurantService = new RestaurantService(restaurantModel);

module.exports = { restaurantService };
