const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class OrderItemValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const min = 1;
    await check('order_id', 'order_id is empty').not().isEmpty().run(req);
    await check('order_id', `order_id must be number min ${min}`).isInt({ min }).run(req);

    await check('product_id', 'product_id is empty').not().isEmpty().run(req);
    await check('product_id', `product_id must be number min ${min}`).isInt({ min }).run(req);

    await check('price', 'Price is empty').not().isEmpty().run(req);
    await check('price', 'Price must be floating point').isDecimal().run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.OrderItemValidator}
 */
OrderItemValidator.prototype.OrderItemValidator = OrderItemValidator;

const orderItemValidator = new OrderItemValidator();

module.exports = { orderItemValidator };