const { BaseService } = require('./base.service');
const { customerModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class CustomerService extends BaseService {
}

/**
 * @type {module:service.CustomerService}
 */
CustomerService.prototype.CustomerService = CustomerService;

const customerService = new CustomerService(customerModel);

module.exports = { customerService };
