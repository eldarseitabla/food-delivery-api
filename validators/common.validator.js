const ajv = require('ajv');
const httpErrors = require('http-errors');

const openapi = require('../public/openapi.json');

/**
 * @memberOf module:validator
 * @class
 * @instance
 */
class CommonValidator {

  constructor () {
    this.apiKey = 'openapi.json';
    this.ajv = ajv({
      allErrors: true,
      removeAdditional: true,
      schemaId: 'auto',
    }).addSchema(openapi, this.apiKey);
  }

  /**
   * @param {Request} req
   * @return {Promise<{errors: [], isValid: boolean }>}
   */
  async checkFilter (req) {
    const defaultProps = {
      where: { field: 'id', operator: '>', value: 0 },
      orderBy: { sort_direction: 'ASC', field: 'id' },
      offset: 0,
      limit: 100,
    };
    try {
      const resultCheck = {
        errors: [],
        isValid: true,
      };
      if (req.query.filter !== undefined) {
        req.query.filter = JSON.parse(req.query.filter);
        resultCheck.isValid = this.ajv.validate({ $ref: `${this.apiKey}#/components/schemas/CommonFilter` }, req.query.filter);
        resultCheck.errors.push('filter does not match the schema');

        if (req.query.filter.where === undefined) {
          req.query.filter['where'] = defaultProps.where;
        }

        if (req.query.filter.order_by === undefined) {
          req.query.filter['order_by'] = defaultProps.orderBy;
        }

        if (req.query.filter.offset === undefined) {
          req.query.filter['offset'] = defaultProps.offset;
        }

        if (req.query.filter.limit === undefined) {
          req.query.filter['limit'] = defaultProps.limit;
        }
      } else {
        req.query['filter'] = {
          where: defaultProps.where,
          order_by: defaultProps.orderBy,
          offset: defaultProps.offset,
          limit: defaultProps.limit,
        };
      }
      return resultCheck;
    } catch (err) {
      throw new httpErrors.UnsupportedMediaType(err.message);
    }
  }
}

module.exports = { CommonValidator };
