const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CourierOrderValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const min = 1;
    await check('courier_id', 'courier_id is empty').not().isEmpty().run(req);
    await check('courier_id', `courier_id must be number min ${min}`).isInt({ min }).run(req);

    await check('order_id', 'order_id is empty').not().isEmpty().run(req);
    await check('order_id', `order_id must be number min ${min}`).isInt({ min }).run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.CourierOrderValidator}
 */
CourierOrderValidator.prototype.CourierOrderValidator = CourierOrderValidator;

const courierOrderValidator = new CourierOrderValidator();

module.exports = { courierOrderValidator };
