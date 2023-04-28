const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const { PORT = 3000 } = process.env;

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);

app.post('/signup', createUser);

app.use('/users', auth, routerUsers);

app.use('/cards', auth, routerCards);

// app.use('*', (req, res) => {
//   res.status(404).send({ message: 'Некорректный путь или запрос.' });
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err.name);

  if (err.name === 'AuthenticationError') {
    res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'NotFoundError') {
    res.status(404).send({ message: err.message });
  }

  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Некорректный id.' });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные.' });
    return;
  }

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {

});
