const { BaseService } = require('./base.service');
const { courierModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class CourierService extends BaseService {
  async findWhereDidHeGo (filter) {
    return this._model.findWhereDidHeGo(filter);
  }

  async howManyOrdersCompleted (filter) {
    return this._model.howManyOrdersCompleted(filter);
  }

  async howMuchDidCompleteOrders (filter) {
    return this._model.howMuchDidCompleteOrders(filter);
  }

  async averageDeliveryTime (filter) {
    return this._model.averageDeliveryTime(filter);
  }
}

/**
 * @type {module:service.CourierService}
 */
CourierService.prototype.CourierService = CourierService;

const courierService = new CourierService(courierModel);

module.exports = { courierService };
