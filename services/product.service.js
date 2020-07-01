const { BaseService } = require('./base.service');
const { productModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class ProductService extends BaseService {
}

/**
 * @type {module:service.ProductService}
 */
ProductService.prototype.ProductService = ProductService;

const productService = new ProductService(productModel);

module.exports = { productService };
