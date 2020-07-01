const { Router } = require('express');
const httpErrors = require('http-errors');
const { orderItemService } = require('../services');
const { orderItemValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class OrderItemController {
  /**
   * @param {module:service.OrderItemService} orderItemService
   * @param {module:validator.OrderItemValidator} orderItemValidator
   */
  constructor (orderItemService, orderItemValidator) {
    /** @type {module:service.OrderItemService}
     * @private */
    this._service = orderItemService;

    /** @type {module:validator.OrderItemValidator}
     * @private */
    this._validator = orderItemValidator;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async create (req, res, next) {
    try {
      const errors = await this._validator.check(req);
      if (!errors.isEmpty()) {
        return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
      }

      const { order_id, product_id, price } = req.body;
      const result = await this._service.create({ order_id, product_id, price });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async updateOne (req, res, next) {
    try {
      const errors = await this._validator.check(req);
      if (!errors.isEmpty()) {
        return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
      }
      const { id } = req.params;
      const { order_id, product_id, price } = req.body;
      const result = await this._service.updateOne(id, { order_id, product_id, price });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'OrderItem not found'));
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
const orderItemController = new OrderItemController(orderItemService, orderItemValidator);

const orderItem = Router();

// Create orderItem
orderItem.post('', async (req, res, next) => {
  await orderItemController.create(req, res, next);
});

// Update orderItem
orderItem.patch('/:id(\\d+)', async (req, res, next) => {
  await orderItemController.updateOne(req, res, next);
});

// Get orderItem by id
orderItem.get('/:id(\\d+)', async (req, res, next) => {
  await orderItemController.findOne(req, res, next);
});

// Get many orderItems
orderItem.get('', async (req, res, next) => {
  await orderItemController.findAll(req, res, next);
});

orderItem.delete('/:id', async (req, res) => {
  await orderItemController.deleteOne(req, res);
});

orderItem.delete('', async (req, res) => {
  await orderItemController.deleteAll(req, res);
});

module.exports = { orderItem };
