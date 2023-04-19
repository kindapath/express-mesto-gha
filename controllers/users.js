const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорретно введенны данные.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.editProfile = (req, res) => {
  const {
    name, about,
  } = req.body;

  const {
    _id: userId,
  } = req.user;

  User.findByIdAndUpdate(userId, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля. ' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;

  const {
    _id: userId,
  } = req.user;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
