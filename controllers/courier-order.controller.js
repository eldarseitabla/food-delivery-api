const { Router } = require('express');
const httpErrors = require('http-errors');
const { courierOrderService } = require('../services');
const { courierOrderValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class CourierOrderController {
  /**
   * @param {module:service.CourierOrderService} courierOrderService
   * @param {module:validator.CourierOrderValidator} courierOrderValidator
   */
  constructor (courierOrderService, courierOrderValidator) {
    /** @type {module:service.CourierOrderService}
     * @private */
    this._service = courierOrderService;

    /** @type {module:validator.CourierOrderValidator}
     * @private */
    this._validator = courierOrderValidator;
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

      const { courier_id, order_id } = req.body;
      const result = await this._service.create({ courier_id, order_id });
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
      const { courier_id, order_id, statusOrder } = req.body;
      const result = await this._service.updateOne(id, { courier_id, order_id, statusOrder });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'CourierOrder not found'));
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
const courierOrderController = new CourierOrderController(courierOrderService, courierOrderValidator);

const courierOrder = Router();

// Create courierOrder
courierOrder.post('', async (req, res, next) => {
  await courierOrderController.create(req, res, next);
});

// Update courierOrder
courierOrder.patch('/:id(\\d+)', async (req, res, next) => {
  await courierOrderController.updateOne(req, res, next);
});

// Get courierOrder by id
courierOrder.get('/:id(\\d+)', async (req, res, next) => {
  await courierOrderController.findOne(req, res, next);
});

// Get many courierOrders
courierOrder.get('', async (req, res, next) => {
  await courierOrderController.findAll(req, res, next);
});

courierOrder.delete('/:id', async (req, res) => {
  await courierOrderController.deleteOne(req, res);
});

courierOrder.delete('', async (req, res) => {
  await courierOrderController.deleteAll(req, res);
});

module.exports = { courierOrder };
