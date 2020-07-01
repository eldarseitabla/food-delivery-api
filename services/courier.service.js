const { BaseService } = require('./base.service');
const { courierModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class CourierService extends BaseService {
}

/**
 * @type {module:service.CourierService}
 */
CourierService.prototype.CourierService = CourierService;

const courierService = new CourierService(courierModel);

module.exports = { courierService };
