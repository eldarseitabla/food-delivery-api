const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const {
  courierService,
  courierOrderService,
  customerService,
  orderService,
} = require('../../services');
const { config } = require('../../config');

describe('courier-order.controller (acceptance)', () => {
  const testCourier = { name: 'Rock' };
  const testCustomer = { name: 'Some customer', address: 'Some address' };
  const testOrder = {
    payment_status: config.order.paymentStatus.notPaid,
    status: config.order.status.created,
    address: 'some address',
  };

  beforeEach('before each', async () => {
    await courierOrderService.deleteAll();
    await orderService.deleteAll();
    await customerService.deleteAll();
  });

  async function createDependencies () {
    const courier = await courierService.create(testCourier);
    const customer = await customerService.create(testCustomer);
    const order = await orderService.create({
      ...testOrder,
      customer_id: customer.id,
    });
    return { courier_id: courier.id, order_id: order.id };
  }

  it('create success', async () => {
    const { courier_id, order_id } = await createDependencies();
    const { body: result } = await request(app)
      .post('/courier-order')
      .send({
        courier_id, order_id,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      courier_id,
      order_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    const { courier_id, order_id } = await createDependencies();

    await courierOrderService.create({ courier_id, order_id });

    const { body: result } = await request(app)
      .get('/courier-order?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      courier_id, order_id,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const { courier_id, order_id } = await createDependencies();

    const created = await courierOrderService.create({ courier_id, order_id });
    const { body: result } = await request(app)
      .get(`/courier-order/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      courier_id,
      order_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const { courier_id, order_id } = await createDependencies();
    const created = await courierOrderService.create({
      courier_id, order_id,
    });

    const courierSecond = await courierService.create(testCourier);

    const changedData = { courier_id: courierSecond.id, order_id };

    const { body: result } = await request(app)
      .patch(`/courier-order/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      order_id,
      ...changedData,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const { courier_id, order_id } = await createDependencies();
    const created = await courierOrderService.create({
      courier_id, order_id,
    });
    await request(app)
      .del(`/courier-order/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/courier-order?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    const { courier_id, order_id } = await createDependencies();
    await courierOrderService.create({ courier_id, order_id });
    await courierOrderService.create({ courier_id, order_id });
    const { body: resultAfterCreated } = await request(app)
      .get('/courier-order?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/courier-order')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/courier-order?limit=10')
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
