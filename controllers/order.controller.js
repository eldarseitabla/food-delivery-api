const { Router } = require('express');
const httpErrors = require('http-errors');
const { orderService } = require('../services');
const { orderValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class OrderController {
  /**
   * @param {module:service.OrderService} orderService
   * @param {module:validator.OrderValidator} orderValidator
   */
  constructor (orderService, orderValidator) {
    /** @type {module:service.OrderService}
     * @private */
    this._service = orderService;

    /** @type {module:validator.OrderValidator}
     * @private */
    this._validator = orderValidator;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async create (req, res, next) {
    try {
      const resultCheck = await this._validator.check(req);
      if (!resultCheck.isValid) {
        return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
      }

      const { customer_id, payment_status, status, address } = req.body;
      const result = await this._service.create({ customer_id, payment_status, status, address });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async updateOne (req, res, next) {
    try {
      const resultCheck = await this._validator.check(req);
      if (!resultCheck.isValid) {
        return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
      }
      const { id } = req.params;
      const { customer_id, payment_status, status, address } = req.body;
      const result = await this._service.updateOne(id, { customer_id, payment_status, status, address });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'Order not found'));
    }
    res.json(result);
  }

  async findAll (req, res, next) {
    const resultCheck = await this._validator.checkFilter(req);
    if (!resultCheck.isValid) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(resultCheck.errors)));
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
const orderController = new OrderController(orderService, orderValidator);

const order = Router();

// Create order
order.post('', async (req, res, next) => {
  await orderController.create(req, res, next);
});

// Update order
order.patch('/:id(\\d+)', async (req, res, next) => {
  await orderController.updateOne(req, res, next);
});

// Get order by id
order.get('/:id(\\d+)', async (req, res, next) => {
  await orderController.findOne(req, res, next);
});

// Get many orders
order.get('', async (req, res, next) => {
  await orderController.findAll(req, res, next);
});

order.delete('/:id', async (req, res) => {
  await orderController.deleteOne(req, res);
});

order.delete('', async (req, res) => {
  await orderController.deleteAll(req, res);
});

module.exports = { order };
