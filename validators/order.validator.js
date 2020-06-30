const httpErrors = require('http-errors');
const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');
const { config } = require('../config');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class OrderValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const { payment_status, status } = req.body;
    if (!config.order.paymentStatus[payment_status]) {
      throw new httpErrors.UnprocessableEntity(`payment_status not as expected: ${payment_status}`);
    }

    if (!config.order.status[status]) {
      throw new httpErrors.UnprocessableEntity(`status not as expected: ${status}`);
    }

    const minChars = 6;
    await check('customer_id', 'customer_id is empty').not().isEmpty().run(req);
    await check('customer_id', 'customer_id must be number min 0').isInt({ min: 1 }).run(req);

    await check('payment_status', 'payment_status is empty').not().isEmpty().run(req);
    await check('status', 'status is empty').not().isEmpty().run(req);

    await check('address', 'Address is empty').not().isEmpty().run(req);
    await check('address', `Address must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.OrderValidator}
 */
OrderValidator.prototype.OrderValidator = OrderValidator;

const orderValidator = new OrderValidator();

module.exports = { orderValidator };
