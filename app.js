const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const app = express();

const { PORT = 3000 } = process.env;

const { errorHandler } = require('./errors/errorHandler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
