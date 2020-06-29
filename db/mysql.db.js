const mysql = require('mysql');
const { config } = require('../config');

const configConnection = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

/**
 * @memberOf module:db
 * @type {Connection}
 * @instance
 */
const mysqlDb = mysql.createConnection(configConnection);

module.exports = { mysqlDb };
