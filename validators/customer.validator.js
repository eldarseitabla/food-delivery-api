const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CustomerValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const minChars = 6;
    await check('name', 'Name is empty').not().isEmpty().run(req);
    await check('name', `Name must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);

    await check('address', 'Address is empty').not().isEmpty().run(req);
    await check('address', `Address must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.CustomerValidator}
 */
CustomerValidator.prototype.CustomerValidator = CustomerValidator;

const customerValidator = new CustomerValidator();

module.exports = { customerValidator };
