const mysql = require('mysql');
const { config } = require('../config');

/**
 * @memberOf module:db
 * @type {Connection}
 * @instance
 */
const mysqlDb = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

module.exports = { mysqlDb };
