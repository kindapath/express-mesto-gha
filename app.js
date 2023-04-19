const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '643d4313303f7c6c849b8c68', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', routerUsers);

app.use('/cards', routerCards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Некорректный путь или запрос.' });
});

app.listen(PORT, () => {

});
