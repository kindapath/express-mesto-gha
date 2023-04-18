const Card = require('../models/card');

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
      const ERROR_CODE = 400;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные при создании карточки.' },
        );
      }

      return res.status(500).send({ message: err.message });
    });
};
module.exports.deleteCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      const NOTFOUND_CODE = 404;

      return res.status(NOTFOUND_CODE).send(
        { message: 'Карточка с указанным _id не найдена.' },
      );
    });
};

module.exports.likeCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  const {
    _id: userId,
  } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const NOTFOUND_CODE = 404;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные для постановки/снятии лайка. ' },
        );
      }
      if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send(
          { message: 'Передан несуществующий _id карточки. ' },
        );
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  const {
    _id: userId,
  } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const NOTFOUND_CODE = 404;

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send(
          { message: 'Переданы некорректные данные для постановки/снятии лайка. ' },
        );
      }
      if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send(
          { message: 'Передан несуществующий _id карточки. ' },
        );
      }

      return res.status(500).send({ message: err.message });
    });
};
