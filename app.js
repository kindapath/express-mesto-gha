const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const app = express();

const { PORT = 3000 } = process.env;

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regex } = require('./constatant/constants');
const NotFoundError = require('./errors/not-found-err');
const { errorHandler } = require('./errors/errorHandler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),

  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/users', auth, routerUsers);

app.use('/cards', auth, routerCards);

app.use('*', () => {
  throw new NotFoundError('Некорректный путь или запрос.');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
