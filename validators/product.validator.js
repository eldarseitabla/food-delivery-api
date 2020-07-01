const { check, validationResult } = require('express-validator');
const { CommonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class ProductValidator extends CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const minChars = 6;
    const min = 1;
    await check('name', 'Name is empty').not().isEmpty().run(req);
    await check('name', `Name must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);

    await check('price', 'Price is empty').not().isEmpty().run(req);
    await check('price', 'Price must be floating point').isDecimal().run(req);

    await check('description', 'Description is empty').not().isEmpty().run(req);
    await check('description', `Description must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);

    await check('picture', 'Picture is empty').not().isEmpty().run(req);
    await check('picture', `Picture must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);

    await check('restaurant_id', 'restaurant_id is empty').not().isEmpty().run(req);
    await check('restaurant_id', `restaurant_id must be number min ${min}`).isInt({ min }).run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.ProductValidator}
 */
ProductValidator.prototype.ProductValidator = ProductValidator;

const productValidator = new ProductValidator();

module.exports = { productValidator };
