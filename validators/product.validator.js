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

  async checkFilter (req) {
    const errorsFilter = await super.checkFilter(req);
    if (!errorsFilter.isEmpty()) {
      return errorsFilter;
    }
    const min = 1;
    if (req.query.filter !== undefined) {

      if (req.query.filter.where !== undefined) {
        await check('filter.where.field', `filter.where.field must be number min ${min}`).isIn(['restaurant_id']).run(req);
        await check('filter.where.value', `filter.where.value must be number min ${min}`).isInt({ min }).run(req);
      }

      if (req.query.filter.order_by !== undefined) {
        await check('filter.order_by.sort_direction', 'filter.order_by must be ASC | DESC').isIn(['ASC', 'DESC']).run(req);

        await check('filter.order_by.field', 'filter.order_by.field is empty').not().isEmpty().run(req);
      }
    }
    return validationResult(req);
  }
}

/**
 * @type {module:validator.ProductValidator}
 */
ProductValidator.prototype.ProductValidator = ProductValidator;

const productValidator = new ProductValidator();

module.exports = { productValidator };
