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
   * @param {number} limit
   * @param {number} offset
   * @return {Promise<Array>}
   */
  async findAll (limit, offset) {
    return this._db(this.table).limit(limit).offset(offset);
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
