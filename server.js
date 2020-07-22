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
  try {
    logger.info('Start SIGINT');
    await app.get('shutdown')();
    await server.close();
    logger.info('SIGINT Successful');
    process.exit(0);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    logger.info('Start SIGTERM');
    await app.get('shutdown')();
    await server.close();
    logger.info('SIGTERM Successful');
    process.exit(0);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, p) => {
  logger.fatal('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

process.on('uncaughtException', err => {
  logger.fatal('Unhandled Exception at: ', err);
});
