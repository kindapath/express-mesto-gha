const ErrorHandler = require('../errors/ErrorHandler');

const User = require('../models/user');

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

      ErrorHandler.sendError(errorInfo);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  ErrorHandler.isValidObjectId({
    id: userId,
    res,
    message: 'Передан некорректный _id пользователя.',
  });

  User.findById(userId)
    .then((user) => {
      ErrorHandler.checkIfNull(user);

      res.send(user);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        validationMessage: 'Передан некорректный _id.',
        castMessage: 'Пользователь по указанному _id не найден.',
      };

      ErrorHandler.sendError(errorInfo);
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

      ErrorHandler.sendError(errorInfo);
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

      ErrorHandler.sendError(errorInfo);
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

      ErrorHandler.sendError(errorInfo);
    });
};
