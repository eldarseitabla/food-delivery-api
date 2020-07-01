const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { orderService, customerService } = require('../../services');
const { filter } = require('../helpers/utils');

describe('order.controller (acceptance)', () => {
  const data = { payment_status: 'notPaid', status: 'created', address: 'some address' };
  const testCustomer = { name: 'Test customer', address: 'test address' };

  beforeEach('before each', async () => {
    await orderService.deleteAll();
    await customerService.deleteAll();
  });

  it('create success', async () => {
    const customer = await customerService.create(testCustomer);
    const { body: result } = await request(app)
      .post('/order')
      .send({
        ...data,
        customer_id: customer.id,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      customer_id: customer.id,
      ...data,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    const customer = await customerService.create(testCustomer);
    await orderService.create({
      customer_id: customer.id,
      ...data,
    });

    const { body: result } = await request(app)
      .get(`/order?filter=${encodeURIComponent(filter)}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      customer_id: customer.id,
      ...data,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const customer = await customerService.create(testCustomer);
    const created = await orderService.create({
      customer_id: customer.id,
      ...data,
    });
    const { body: result } = await request(app)
      .get(`/order/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      customer_id: customer.id,
      ...data,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const customer = await customerService.create(testCustomer);
    const created = await orderService.create({
      ...data,
      customer_id: customer.id,
    });

    const changedData = { ...data, payment_status: 'paid', customer_id: customer.id };

    const { body: result } = await request(app)
      .patch(`/order/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      customer_id: customer.id,
      ...data,
      ...changedData,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const customer = await customerService.create(testCustomer);
    const created = await orderService.create({
      customer_id: customer.id,
      ...data,
    });
    await request(app)
      .del(`/order/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/order')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    const customer = await customerService.create(testCustomer);
    await orderService.create({ ...data, customer_id: customer.id });
    await orderService.create({ ...data, name: 'Second order', customer_id: customer.id });
    const { body: resultAfterCreated } = await request(app)
      .get('/order')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/order')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/order')
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
