const { config } = require('./config');
const { getLogger } = require('log4js');

const { app } = require('./app');

const logger = getLogger('[server]');

let server;
(async () => {
  try {
    await app.get('init')();
    server = await app.listen(app.get('port'), config.host);
    logger.info('App is running at http://%s:%d in %s mode', config.host, app.get('port'), process.env.NODE_ENV);
  } catch (err) {
    logger.error({ message: 'Error start server', err });
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
  await app.get('shutdown')();
  server.close((error) => {
    if (error) {
      logger.error(`SIGINT ${error.message}`);
      process.exit(1);
    }
    logger.debug('SIGINT');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  await app.get('shutdown')();
  server.close((error) => {
    if (error) {
      logger.error(`SIGTERM ${error.message}`);
      process.exit(1);
    }
    logger.debug('SIGTERM');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, p) => {
  logger.fatal('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

process.on('uncaughtException', err => {
  logger.fatal('Unhandled Exception at: ', err);
});
