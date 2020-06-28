const { check, validationResult } = require('express-validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class RestaurantValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const minChars = 6;
    await check('name', `Name must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    await check('name', 'Name is empty').not().isEmpty().run(req);

    await check('picture', `picture must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    await check('picture', 'picture is empty').not().isEmpty().run(req);
    return validationResult(req);
  }

  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async checkPagination (req) {
    await check('limit', 'limit must be number min: 1, max: 100').isInt({ min: 1, max: 100 }).run(req);

    if (req.query.offset !== undefined) {
      await check('offset', 'id must be number min 0').isInt({ min: 0 }).run(req);
    } else {
      req.query['offset'] = 0;
    }
    return validationResult(req);
  }
}

const restaurantValidator = new RestaurantValidator();

module.exports = { restaurantValidator };
