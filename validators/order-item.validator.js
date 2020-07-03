const httpErrors = require('http-errors');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class OrderItemValidator extends CommonValidator {
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
      resultCheck.isValid = this.ajv.validate({ $ref: `${this.apiKey}#/components/schemas/OrderItemRequestBody` }, req.body);
      resultCheck.errors.push('request body does not match the schema');
      return resultCheck;
    } catch (err) {
      throw new httpErrors.UnsupportedMediaType(err.message);
    }
  }
}

/**
 * @type {module:validator.OrderItemValidator}
 */
OrderItemValidator.prototype.OrderItemValidator = OrderItemValidator;

const orderItemValidator = new OrderItemValidator();

module.exports = { orderItemValidator };
