const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { orderItemService, customerService, orderService, restaurantService, productService } = require('../../services');
const { config } = require('../../config');

describe('order-item.controller (acceptance)', () => {
  const data = { order_id: 1, product_id: 1, price: 220.74 };
  const testCustomer = { name: 'Some customer', address: 'Some address' };
  const testOrder = {
    payment_status: config.order.paymentStatus.notPaid,
    status: config.order.status.created,
    address: 'some address',
  };
  const testRestaurant = { name: 'Some Restaurant', picture: 'some_pic_restaurant' };
  const testProduct = {
    name: 'Some product',
    price: 400.10,
    description: 'some description',
    picture: 'some_picture',
  };

  beforeEach('before each', async () => {
    await orderItemService.deleteAll();
    await productService.deleteAll();
    await orderService.deleteAll();
    await restaurantService.deleteAll();
    await customerService.deleteAll();
  });

  async function createDependencies () {
    const restaurant = await restaurantService.create(testRestaurant);
    const product = await productService.create({
      ...testProduct,
      restaurant_id: restaurant.id,
    });
    const customer = await customerService.create(testCustomer);
    const order = await orderService.create({
      ...testOrder,
      customer_id: customer.id,
    });
    return { product_id: product.id, customer_id: customer.id, order_id: order.id };
  }

  it('create success', async () => {
    const {
      product_id,
      order_id,
    } = await createDependencies();
    const { body: result } = await request(app)
      .post('/order-item')
      .send({
        ...data,
        order_id,
        product_id,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      ...data,
      id: result.id,
      order_id,
      product_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    const { product_id, order_id } = await createDependencies();

    await orderItemService.create({
      ...data,
      product_id,
      order_id,
    });

    const { body: result } = await request(app)
      .get('/order-item?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      ...data,
      id: result[0].id,
      product_id,
      order_id,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const { product_id, order_id } = await createDependencies();

    const created = await orderItemService.create({
      ...data,
      product_id,
      order_id,
    });
    const { body: result } = await request(app)
      .get(`/order-item/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      ...data,
      id: result.id,
      product_id,
      order_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const { product_id, order_id } = await createDependencies();
    const created = await orderItemService.create({
      ...data,
      product_id,
      order_id,
    });

    const changedData = { ...data, price: 333.04, product_id, order_id };

    const { body: result } = await request(app)
      .patch(`/order-item/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      ...data,
      ...changedData,
      product_id,
      order_id,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const { product_id, order_id } = await createDependencies();
    const created = await orderItemService.create({
      ...data,
      product_id,
      order_id,
    });
    await request(app)
      .del(`/order-item/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/order-item?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    const { product_id, order_id } = await createDependencies();
    await orderItemService.create({ ...data, product_id, order_id });
    await orderItemService.create({ ...data, name: 'Second orderItem', product_id, order_id });
    const { body: resultAfterCreated } = await request(app)
      .get('/order-item?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/order-item')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/order-item?limit=10')
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
