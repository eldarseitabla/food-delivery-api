const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const { config } = require('./config');
const { mysqlClient } = require('./db');

const {
  errorMiddleware,
  notFoundMiddleware,
  performTimingMiddleware,
} = require('./middleware');

const {
  restaurant,
  courier,
} = require('./controllers');

const init = async () => {
  await mysqlClient.raw('SELECT * FROM migrations LIMIT 1');
};

const shutdown = async () => {
  await mysqlClient.destroy();
};

const app = express();
app.set('port', config.port || 3000);
app.set('init', init);
app.set('shutdown', shutdown);
app.use(cors());
app.use(performTimingMiddleware());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.get('/', (req, res) => { res.sendFile('./public/index.html'); });
app.get('/favicon.ico', (req, res) => { res.sendFile('./public/favicon.png');});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, config.swaggerUi.options));
app.use('/restaurant', restaurant);
app.use('/courier', courier);
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
