// const request = require('supertest');
const assert = require('assert');
const { createSandbox } = require('sinon');
const { app } = require('../../app');
// const { config } = require('../../config');

const sandbox = createSandbox();

describe('restaurant.controller (acceptance)', () => {
  // const data = { name: 'Test Restaurant', picture: 'some_pic_test' };

  before('before all', async () => {
    await app.get('init')();
  });

  beforeEach('before each', async () => {
  });

  afterEach('after each', () => {
    sandbox.verifyAndRestore();
  });

  it('Create restaurant', async () => {
    // const { body: result } = await request(app)
    //   .post('/restaurant')
    //   .send(data)
    //   .expect('Content-Type', 'application/json; charset=utf-8')
    //   .expect(200);
    assert.ok(false);
  });

  it('Get restaurants', async () => {
    assert.ok(false);
  });

  it('Get restaurant', async () => {
    assert.ok(false);
  });

  it('Update restaurant', async () => {
    assert.ok(false);
  });
});
