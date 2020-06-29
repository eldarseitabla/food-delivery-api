const { check, validationResult } = require('express-validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CommonValidator {
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

/**
 * @type {module:validator.CommonValidator}
 * @name CommonValidator
 */
CommonValidator.prototype.CommonValidator = CommonValidator;

const commonValidator = new CommonValidator();

module.exports = { commonValidator };
