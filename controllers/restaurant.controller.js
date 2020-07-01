const { Router } = require('express');
const httpErrors = require('http-errors');
const { restaurantService } = require('../services');
const { restaurantValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class RestaurantController {
  /**
   * @param {module:service.RestaurantService} restaurantService
   * @param {module:validator.RestaurantValidator} restaurantValidator
   */
  constructor (restaurantService, restaurantValidator) {
    /** @type {module:service.RestaurantService}
     * @private */
    this._service = restaurantService;
    /** @type {module:validator.RestaurantValidator}
     * @private */
    this._validator = restaurantValidator;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async create (req, res, next) {
    const errors = await this._validator.check(req);
    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }
    try {
      const { name, picture } = req.body;
      const result = await this._service.create({ name, picture });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async updateOne (req, res, next) {
    const errors = await this._validator.check(req);
    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    try {
      const { id } = req.params;
      const { name, picture } = req.body;
      const result = await this._service.updateOne(id, { name, picture });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'Restaurant not found'));
    }
    res.json(result);
  }

  async findAll (req, res, next) {
    const errorsFilter = await this._validator.checkFilter(req);
    if (!errorsFilter.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errorsFilter.array())));
    }
    const { filter } = req.query;
    const result = await this._service.findAll(filter);
    res.json(result);
  }

  async deleteOne (req, res) {
    const { id } = req.params;
    await this._service.deleteOne(id);
    res.status(204).send();
  }

  async deleteAll (req, res) {
    await this._service.deleteAll();
    res.status(204).send();
  }
}
const restaurantController = new RestaurantController(restaurantService, restaurantValidator);

const restaurant = Router();

// Create restaurant
restaurant.post('', async (req, res, next) => {
  await restaurantController.create(req, res, next);
});

// Update restaurant
restaurant.patch('/:id(\\d+)', async (req, res, next) => {
  await restaurantController.updateOne(req, res, next);
});

// Get restaurant by id
restaurant.get('/:id(\\d+)', async (req, res, next) => {
  await restaurantController.findOne(req, res, next);
});

// Get many restaurants
restaurant.get('', async (req, res, next) => {
  await restaurantController.findAll(req, res, next);
});

restaurant.delete('/:id', async (req, res) => {
  await restaurantController.deleteOne(req, res);
});

restaurant.delete('', async (req, res) => {
  await restaurantController.deleteAll(req, res);
});

module.exports = { restaurant };
