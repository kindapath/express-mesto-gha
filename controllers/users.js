const mongoose = require('mongoose');

const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');

const User = require('../models/user');

function sendError({
  err, validationMessage, castMessage, res,
}) {
  const ERROR_CODE = 400;
  const NOTFOUND_CODE = 404;
  const DEFAULT_CODE = 500;

  if (err.name === 'ValidationError') {
    return res.status(ERROR_CODE).send(
      { message: validationMessage },
    );
  }

  if (err.name === 'CastError') {
    return res.status(NOTFOUND_CODE).send(
      { message: castMessage },
    );
  }

  sendError(res);
  return res.status(DEFAULT_CODE).send({ message: err.message });
}

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
      };

      sendError(errorInfo);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send({ message: 'Передан некорректный _id.' });
    throw new ValidationError();
  }
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new CastError();
      }

      res.send(user);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        validationMessage: 'Передан некорректный _id.',
        castMessage: 'Пользователь по указанному _id не найден.',
      };

      sendError(errorInfo);
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
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные при создании пользователя.',
      };

      sendError(errorInfo);
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
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные при обновлении профиля.',
        castMessage: 'Пользователь по указанному _id не найден.',
      };

      sendError(errorInfo);
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
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные при обновлении аватара.',
        castMessage: 'Пользователь по указанному _id не найден.',
      };

      sendError(errorInfo);
    });
};
