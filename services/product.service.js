const { BaseService } = require('./base.service');
const { productModel } = require('../models');

/**
 * @memberOf module:service
 * @class
 * @instance
 */
class ProductService extends BaseService {
  /**
   * @param {Object} filter
   * @return {Promise<Array>}
   */
  async findAll (filter) {
    return this._model.findAll(filter);
  }
}

/**
 * @type {module:service.ProductService}
 */
ProductService.prototype.ProductService = ProductService;

const productService = new ProductService(productModel);

module.exports = { productService };
