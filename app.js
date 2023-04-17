const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('db is connected'))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '643d4313303f7c6c849b8c68', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', routerUsers);

app.use('/cards', routerCards);

app.listen(PORT, () => {
  console.log('Trying to make my own server with APIs!');
});
