const { Router } = require('express');
const httpErrors = require('http-errors');
const { productService } = require('../services');
const { productValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class ProductController {
  /**
   * @param {module:service.ProductService} productService
   * @param {module:validator.ProductValidator} productValidator
   */
  constructor (productService, productValidator) {
    /** @type {module:service.ProductService}
     * @private */
    this._service = productService;

    /** @type {module:validator.ProductValidator}
     * @private */
    this._validator = productValidator;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async create (req, res, next) {
    const resultCheck = await this._validator.check(req);
    if (!resultCheck.isValid) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
    }
    try {
      const { name, price, description, picture, restaurant_id } = req.body;
      const result = await this._service.create({ name, price, description, picture, restaurant_id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async updateOne (req, res, next) {
    const resultCheck = await this._validator.check(req);
    if (!resultCheck.isValid) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
    }

    try {
      const { id } = req.params;
      const { name, price, description, picture, restaurant_id } = req.body;
      const result = await this._service.updateOne(id, { name, price, description, picture, restaurant_id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'Product not found'));
    }
    res.json(result);
  }

  /**
   * TODO Rename to find()
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async find (req, res, next) {
    const resultCheck = await this._validator.checkFilter(req);
    if (!resultCheck.isValid) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
    }
    const { filter } = req.query;
    const result = await this._service.find(filter);
    res.json(result);
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @return {Promise<*>}
   */
  async deleteOne (req, res) {
    const { id } = req.params;
    await this._service.deleteOne(id);
    res.status(204).send();
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @return {Promise<*>}
   */
  async deleteAll (req, res) {
    await this._service.deleteAll();
    res.status(204).send();
  }
}
const productController = new ProductController(productService, productValidator);

const product = Router();

// Create product
product.post('', async (req, res, next) => {
  await productController.create(req, res, next);
});

// Update product
product.patch('/:id(\\d+)', async (req, res, next) => {
  await productController.updateOne(req, res, next);
});

// Get product by id
product.get('/:id(\\d+)', async (req, res, next) => {
  await productController.findOne(req, res, next);
});

// Get many products
product.get('', async (req, res, next) => {
  await productController.find(req, res, next);
});

product.delete('/:id', async (req, res) => {
  await productController.deleteOne(req, res);
});

product.delete('', async (req, res) => {
  await productController.deleteAll(req, res);
});

module.exports = { product };
