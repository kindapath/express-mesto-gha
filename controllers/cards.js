const Card = require('../models/card');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const {
    _id: userId,
  } = req.user;

  const {
    name, link,
  } = req.body;

  Card.create({ owner: userId, name, link })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные при создании карточки.',
      };

      ErrorHandler.sendError(errorInfo);
    });
};
module.exports.deleteCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  ErrorHandler.isValidObjectId({
    id: cardId,
    res,
    message: 'Передан некорректный _id карточки.',
  });

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      ErrorHandler.checkIfNull(card);
      res.send(card);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        castMessage: 'Карточка с указанным _id не найдена.',
      };

      ErrorHandler.sendError(errorInfo);
    });
};

module.exports.likeCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  const {
    _id: userId,
  } = req.user;

  ErrorHandler.isValidObjectId({
    id: cardId,
    res,
    message: 'Передан некорректный _id карточки.',
  });

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      ErrorHandler.checkIfNull(card);
      res.send(card);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные для постановки/снятии лайка.',
        castMessage: 'Передан несуществующий _id карточки.',
      };

      ErrorHandler.sendError(errorInfo);
    });
};

module.exports.dislikeCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  const {
    _id: userId,
  } = req.user;

  ErrorHandler.isValidObjectId({
    id: cardId,
    res,
    message: 'Передан некорректный _id карточки.',
  });

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      ErrorHandler.checkIfNull(card);

      res.send(card);
    })
    .catch((err) => {
      const errorInfo = {
        err,
        res,
        validationMessage: 'Переданы некорректные данные для постановки/снятии лайка.',
        castMessage: 'Передан несуществующий _id карточки.',
      };

      ErrorHandler.sendError(errorInfo);
    });
};
