const { Router } = require('express');

class RestaurantController {
  async test (req, res) {
    res.send({ 'message': 'Success' });
  }
}
const restaurantController = new RestaurantController();

const restaurant = Router();

restaurant.get('/test', async (req, res, next) => {
  await restaurantController.test(req, res, next);
});

module.exports = { restaurant };
