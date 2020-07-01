const { check, validationResult } = require('express-validator');
const httpErrors = require('http-errors');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CommonValidator {
  async checkFilter (req) {
    try {
      const offsetMin = 0;
      const limitMin = 1;
      const limitMax = 100;

      if (req.query.filter !== undefined) {
        req.query.filter = JSON.parse(req.query.filter);

        await check('filter.limit', `filter.limit must be number min: ${limitMin}, max: ${limitMax}`).isInt({
          min: limitMin,
          max: limitMax,
        }).run(req);

        if (req.query.filter.offset !== undefined) {
          await check('filter.offset', `filter.offset must be number min ${offsetMin}`).isInt({ min: offsetMin }).run(req);
        } else {
          req.query.filter['offset'] = offsetMin;
        }

        if (req.query.filter.order_by !== undefined) {
          await check('filter.order_by.sort_direction', 'filter.order_by must be ASC | DESC').isIn(['ASC', 'DESC']).run(req);

          await check('filter.order_by.field', 'filter.order_by.field is empty').not().isEmpty().run(req);
        }
      } else {
        req.query['filter'] = { offset: offsetMin, limit: limitMax };
      }

      return validationResult(req);
    } catch (err) {
      throw new httpErrors.UnprocessableEntity(err.message);
    }
  }
}

module.exports = { CommonValidator };
