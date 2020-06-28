const { GenericContainer } = require('testcontainers');
const { config } = require('../../config');

let mysqlContainer;

before(async () => {
  const mongoDbName = 'food_delivery_db_test';
  const mongoPort = 3306;
  try {
    mysqlContainer = await new GenericContainer('mysql')
      .withName('mysql-test')
      .withExposedPorts(mongoPort)
      .withEnv('MONGO_INITDB_DATABASE', mongoDbName)
      .withEnv('MYSQL_ROOT_PASSWORD', 'test')
      .start();
    const host = mysqlContainer.getContainerIpAddress();
    const port = mysqlContainer.getMappedPort(mongoPort);
    config.mysql.host = host;
    config.mysql.port = port;
    config.mysql.database = mongoDbName;
  } catch (e) {
    console.log(e);
  }
});

after(async () => {
  if (mysqlContainer) {
    await mysqlContainer.stop();
  }
});
