class ValidationError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'ValidationError';
  }
}

const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new ValidationError();
      }
      res.send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const NOTFOUND_CODE = 404;

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send(
          { message: 'Передан некорректный _id.' },
        );
      }
      if (err.name === 'ValidationError') {
        return res.status(NOTFOUND_CODE).send(
          { message: 'Пользователь по указанному _id не найден.' },
        );
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные при создании пользователя.' },
        );
      }

      return res.status(500).send({ message: err.message });
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
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const NOTFOUND_CODE = 404;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные при обновлении профиля.' },
        );
      }
      if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send(
          { message: 'Пользователь по указанному _id не найден.' },
        );
      }

      return res.status(500).send({ message: err.message });
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
    upsert: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const NOTFOUND_CODE = 404;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные при обновлении аватара.' },
        );
      }
      if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send(
          { message: 'Пользователь по указанному _id не найден.' },
        );
      }

      return res.status(500).send({ message: err.message });
    });
};
