// TODO DAL

/**
 * @memberOf module:model
 * @class
 * @instance
 */
class BaseModel {

  /** @param {knex.Client} dbClient */
  constructor (dbClient) {

    /** @type {string}
     * @private */
    this._table = '';

    /**
     * @type {knex.Client}
     * @private
     */
    this._db = dbClient;
  }

  /**
   * @param {string} value
   * @returns {void}
   */
  set table (value) {
    this._table = value;
  }

  /**
   * @returns {string}
   */
  get table () {
    return this._table;
  }

  /**
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async create (data) {
    const result = await this._db(this.table).insert(data);
    return this.findOne(result[0]);
  }

  /**
   * @param {number} id
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async updateOne (id, data) {
    await this._db(this.table).where('id', id).update(data);
    return this.findOne(id);
  }

  /**
   * @param {number} id
   * @return {Promise<Object>}
   */
  async findOne (id) {
    const result = await this._db(this.table).where('id', id);
    return result[0];
  }

  /**
   * @param {number} filter.limit
   * @param {number} filter.offset
   * @param {string} filter.where.field
   * @param {number|string} filter.where.value
   * @return {Promise<Array>}
   */
  async findAll (filter) {
    // TODO move it from here
    let { field, value, operator } = { field: 'id', value: 0, operator: '>' };
    const { offset, limit } = filter;
    if (filter.where !== undefined) {
      field = filter.where.field;
      value = filter.where.value;
      operator = '=';
    }
    let sortOrder = 'ASC'; // TODO hardcode
    let sortColumnName = 'created_at'; // TODO hardcode
    if (filter.order_by !== undefined) {
      sortOrder = filter.order_by.sort_direction;
      sortColumnName = filter.order_by.field;
    }
    return this._db(this.table).where(field, operator, value).orderBy(sortColumnName, sortOrder).limit(limit).offset(offset)
  }

  /**
   * @param {number} id
   * @return {Promise<Knex.QueryBuilder<TRecord, number>>}
   */
  async deleteOne (id) {
    return this._db(this.table).where('id', id).del();
  }

  /**
   * @return {Promise<*|Knex.QueryBuilder<any, DeferredKeySelection<any, never>[]>|Knex.QueryBuilder<any, DeferredIndex.Augment<UnwrapArrayMember<any>, any, StrKey<any>>[]>|Knex.QueryBuilder<any, DeferredKeySelection.Augment<UnwrapArrayMember<any>, any, StrKey<any>>[][]>|Knex.QueryBuilder<any, SafePartial<any>[]>|Knex.QueryBuilder<any, number>|request.Response>}
   */
  async deleteAll () {
    return this._db(this.table).del();
  }
}

module.exports = { BaseModel };
