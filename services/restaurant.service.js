const { BaseService } = require('./base.service');
const { restaurantModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class RestaurantService extends BaseService {
}

/**
 * @type {module:service.RestaurantService}
 */
RestaurantService.prototype.RestaurantService = RestaurantService;

const restaurantService = new RestaurantService(restaurantModel);

module.exports = { restaurantService };
