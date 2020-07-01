const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { customerService } = require('../../services');
const { filter } = require('../helpers/utils');

describe('customer.controller (acceptance)', () => {
  const data = { name: 'Test Customer', address: 'test address' };

  beforeEach('before each', async () => {
    await customerService.deleteAll();
  });

  it('Create success', async () => {
    const { body: result } = await request(app)
      .post('/customer')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      ...data,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    await customerService.create(data);

    const { body: result } = await request(app)
      .get(`/customer?filter=${encodeURIComponent(filter)}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      ...data,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const created = await customerService.create(data);
    const { body: result } = await request(app)
      .get(`/customer/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      ...data,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const created = await customerService.create(data);

    const changedData = { name: 'Changed Customer' };

    const { body: result } = await request(app)
      .patch(`/customer/${created.id}`)
      .send({
        ...data,
        ...changedData,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      ...data,
      ...changedData,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const created = await customerService.create(data);
    await request(app)
      .del(`/customer/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/customer')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    await customerService.create(data);
    await customerService.create({ ...data, name: 'Second customer' });
    const { body: resultAfterCreated } = await request(app)
      .get('/customer')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/customer')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/customer')
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
