const httpErrors = require('http-errors');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CourierValidator extends CommonValidator {
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
      resultCheck.isValid = this.ajv.validate({ $ref: `${this.apiKey}#/components/schemas/CourierRequestBody` }, req.body);
      resultCheck.errors.push('request body does not match the schema');
      return resultCheck;
    } catch (err) {
      throw new httpErrors.UnsupportedMediaType(err.message);
    }
  }
}

/**
 * @type {module:validator.CourierValidator}
 */
CourierValidator.prototype.CourierValidator = CourierValidator;

const courierValidator = new CourierValidator();

module.exports = { courierValidator };
