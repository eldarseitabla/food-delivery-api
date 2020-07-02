const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { productService, restaurantService } = require('../../services');
const { filter } = require('../helpers/utils');

describe('product.controller (acceptance)', () => {
  const data = { name: 'Test product', price: 201.04, description: 'Test description', picture: 'some_pic_product' };
  const testRestaurant = { name: 'Test restaurant', picture: 'test_pic_restaurant' };

  beforeEach('before each', async () => {
    await productService.deleteAll();
    await restaurantService.deleteAll();
  });

  it('create success', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    const { body: result } = await request(app)
      .post('/product')
      .send({
        ...data,
        restaurant_id: restaurant.id,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      restaurant_id: restaurant.id,
      ...data,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many by restaurant id', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    const restaurant2 = await restaurantService.create({ name: 'Test restaurant second', ...testRestaurant });
    await productService.create({
      restaurant_id: restaurant.id,
      ...data,
    });

    await productService.create({
      restaurant_id: restaurant2.id,
      ...data,
    });

    const filterByRestaurantId = JSON.stringify({
      where: {
        field: 'restaurant_id',
        operator: '=',
        value: `${restaurant.id}`,
      },
      order_by: {
        sort_direction: 'ASC',
        field: 'id',
      },
      offset: 0,
      limit: 100,
    });

    const { body: result } = await request(app)
      .get(`/product?filter=${encodeURIComponent(filterByRestaurantId)}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      restaurant_id: restaurant.id,
      ...data,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get many', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    await productService.create({
      restaurant_id: restaurant.id,
      ...data,
    });

    const { body: result } = await request(app)
      .get(`/product?filter=${encodeURIComponent(filter)}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      restaurant_id: restaurant.id,
      ...data,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    const created = await productService.create({
      restaurant_id: restaurant.id,
      ...data,
    });
    const { body: result } = await request(app)
      .get(`/product/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      restaurant_id: restaurant.id,
      ...data,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    const created = await productService.create({
      ...data,
      restaurant_id: restaurant.id,
    });

    const changedData = { ...data, name: 'Changed Product', restaurant_id: restaurant.id };

    const { body: result } = await request(app)
      .patch(`/product/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      restaurant_id: restaurant.id,
      ...data,
      name: changedData.name,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    const created = await productService.create({
      restaurant_id: restaurant.id,
      ...data,
    });
    await request(app)
      .del(`/product/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/product')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    const restaurant = await restaurantService.create(testRestaurant);
    await productService.create({ ...data, restaurant_id: restaurant.id });
    await productService.create({ ...data, name: 'Second product', restaurant_id: restaurant.id });
    const { body: resultAfterCreated } = await request(app)
      .get('/product')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/product')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/product')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    // Check after created
    assert.strictEqual(Array.isArray(resultAfterCreated), true);
    assert.strictEqual(resultAfterCreated.length, 2);

    // Check after delete all
    assert.strictEqual(Array.isArray(resultAfterDeleteAll), true);
    assert.strictEqual(resultAfterDeleteAll.length, 0);
  });
});
