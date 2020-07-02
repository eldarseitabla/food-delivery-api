const httpErrors = require('http-errors');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class ProductValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<{ errors: [], isValid: boolean }>}
   */
  async check (req) {
    try {
      const resultCheck = {
        errors: [],
        isValid: true,
      };
      resultCheck.isValid = this.ajv.validate({ $ref: `${this.apiKey}#/components/schemas/ProductRequestBody` }, req.body);
      resultCheck.errors.push('request body does not match the schema');
      return resultCheck;
    } catch (err) {
      throw new httpErrors.UnsupportedMediaType(err.message);
    }
  }
}

/**
 * @type {module:validator.ProductValidator}
 */
ProductValidator.prototype.ProductValidator = ProductValidator;

const productValidator = new ProductValidator();

module.exports = { productValidator };
