const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const { config } = require('./config');

const {
  errorMiddleware,
  notFoundMiddleware,
  performTimingMiddleware,
} = require('./middleware');

const {
  restaurant,
} = require('./controllers');

const init = () => {
  // DB connect
};

const app = express();
app.set('port', config.port || 3000);
app.set('init', init);
app.use(cors());
app.use(performTimingMiddleware());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.get('/', (req, res) => { res.sendFile('./public/index.html'); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, config.swaggerUi.options));
app.use('/restaurant', restaurant);
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
