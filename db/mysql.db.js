const knex = require('knex');
const { config } = require('../config');

const configConnection = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

const mysqlClient = knex({
  client: 'mysql',
  version: '5.7.30',
  connection: configConnection,
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn, done) => {
      // in this example we use pg driver's connection API
      conn.query('SET TIME_ZONE = "UTC";', (err) => {
        if (err) {
          // first query failed, return error and don't try to make next query
          done(err, conn);
        } else {
          // do the second query...
          done(err, conn);
        }
      });
    },
  },
  acquireConnectionTimeout: 10000,
});


/**
 * @memberOf module:db
 * @type {Connection}
 * @instance
 */
// const mysqlDb = mysql.createConnection(configConnection);

module.exports = { mysqlClient };
