const request = require('supertest');
const assert = require('assert');
const { app } = require('../../app');
const { restaurantService } = require('../../services');

describe('restaurant.controller (acceptance)', () => {
  const data = { name: 'Test Restaurant', picture: 'some_pic_test' };

  beforeEach('before each', async () => {
    await restaurantService.deleteAll();
  });

  it('create success', async () => {
    const { body: result } = await request(app)
      .post('/restaurant')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result.id,
      name: data.name,
      picture: data.picture,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    assert.deepStrictEqual(result, expects);
  });

  it('get many', async () => {
    await restaurantService.create(data);

    const { body: result } = await request(app)
      .get('/restaurant?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: result[0].id,
      name: data.name,
      picture: data.picture,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    };

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], expects);
  });

  it('get one', async () => {
    const created = await restaurantService.create(data);
    const { body: result } = await request(app)
      .get(`/restaurant/${created.id}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      name: data.name,
      picture: data.picture,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('update one', async () => {
    const created = await restaurantService.create(data);

    const changedData = { name: 'Changed Restaurant', picture: 'changed_pic_test' };

    const { body: result } = await request(app)
      .patch(`/restaurant/${created.id}`)
      .send(changedData)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const expects = {
      id: created.id,
      name: changedData.name,
      picture: changedData.picture,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
    assert.deepStrictEqual(result, expects);
  });

  it('delete one', async () => {
    const created = await restaurantService.create(data);
    await request(app)
      .del(`/restaurant/${created.id}`)
      .expect(204);

    const { body: result } = await request(app)
      .get('/restaurant?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 0);
  });

  it('delete all', async () => {
    await restaurantService.create(data);
    await restaurantService.create({ name: 'Second restaurant', picture: data.picture });
    const { body: resultAfterCreated } = await request(app)
      .get('/restaurant?limit=10')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    await request(app)
      .del('/restaurant')
      .expect(204);

    const { body: resultAfterDeleteAll } = await request(app)
      .get('/restaurant?limit=10')
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
