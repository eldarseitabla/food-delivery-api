const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { courierService } = require('../../services');
const { filter } = require('../helpers/utils');

describe('courier.controller (acceptance)', () => {
  const data = { name: 'Test Courier' };

  beforeEach('before each', async () => {
    await courierService.deleteAll();
  });

  it('Create success', async () => {
    const { body: result } = await request(app)
      .post('/courier')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      name: data.name,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    await courierService.create(data);
    const { body: result } = await request(app)
      .get(`/courier?filter=${encodeURIComponent(filter)}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      name: data.name,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const created = await courierService.create(data);
    const { body: result } = await request(app)
      .get(`/courier/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      name: data.name,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const created = await courierService.create(data);

    const changedData = { name: 'Changed Courier' };

    const { body: result } = await request(app)
      .patch(`/courier/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      name: changedData.name,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const created = await courierService.create(data);
    await request(app)
      .del(`/courier/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/courier')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    await courierService.create(data);
    await courierService.create({ name: 'Second courier' });
    const { body: resultAfterCreated } = await request(app)
      .get('/courier')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/courier')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/courier')
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
