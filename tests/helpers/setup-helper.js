const { app } = require('../../app');

before(async () => {
  await app.get('init')();
});

after(async () => {
  await app.get('shutdown')();
});
