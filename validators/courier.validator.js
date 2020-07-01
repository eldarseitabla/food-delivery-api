const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CourierValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const minChars = 6;
    await check('name', `Name must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    await check('name', 'Name is empty').not().isEmpty().run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.CourierValidator}
 */
CourierValidator.prototype.CourierValidator = CourierValidator;

const courierValidator = new CourierValidator();

module.exports = { courierValidator };
