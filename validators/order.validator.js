const httpErrors = require('http-errors');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class OrderValidator extends CommonValidator {
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
      resultCheck.isValid = this.ajv.validate({ $ref: `${this.apiKey}#/components/schemas/OrderRequestBody` }, req.body);
      resultCheck.errors.push('request body does not match the schema');
      return resultCheck;
    } catch (err) {
      throw new httpErrors.UnsupportedMediaType(err.message);
    }
  }
}

/**
 * @type {module:validator.OrderValidator}
 */
OrderValidator.prototype.OrderValidator = OrderValidator;

const orderValidator = new OrderValidator();

module.exports = { orderValidator };
