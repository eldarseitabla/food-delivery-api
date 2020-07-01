const fs = require('fs');
const dotenv = require('dotenv');
const { configure } = require('log4js');

function initEnv (envFile) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    console.error(`${envFile} file does not exist`);
    process.exit(1);
  }
}

initEnv('.env');

switch (process.env.NODE_ENV) {
  case 'production':
    configure({
      appenders: {
        logstash: {
          type: '@log4js-node/logstashudp',
          host: process.env.LOGSTASH_HOST,
          port: process.env.LOGSTASH_PORT,
        },
      },
      categories: {
        default: { appenders: ['logstash'], level: 'info' },
      },
    });
    break;
  case 'test':
    configure({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: [ 'console' ], level: 'info' } },
    });
    break;
  default:
    process.env.NODE_ENV = 'development';
    configure({
      appenders: {
        fatalError: { type: 'file', filename: '../../logs/fatal.log' },
        fileError: { type: 'file', filename: '../../logs/error.log' },
        console: { type: 'console' },
      },
      categories: {
        fatalError: { appenders: ['fatalError'], level: 'fatal' },
        fileError: { appenders: ['fileError'], level: 'error' },
        console: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'fileError', 'fatalError'], level: 'trace' },
      },
    });
    break;
}

const config = {
  env: process.env.NODE_ENV || '',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5000,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || '',
  },
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: `http://${process.env.HOST}:${process.env.PORT}/openapi.yml`,
      },
    },
  },
  order: {
    paymentStatus: {
      notPaid: 'notPaid',
      paid: 'paid',
      paymentUponReceipt: 'paymentUponReceipt',
    },
    status: {
      created: 'created',
      active: 'active',
      inProgress: 'inProgress',
      done: 'done',
      canceled: 'canceled',
    },
  },
};

module.exports = { config };
