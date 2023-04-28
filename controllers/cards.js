const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректно введенны данные карточки.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  const {
    _id: userId,
  } = req.user;

  Card.findOneAndRemove({
    _id: cardId,
    owner: userId,
  })
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена или вы не можете ее удалить.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id.' });
      } else {
        res.status(500).send({ message: err.message });
      }
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
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки или пользователя.' });
      } else {
        res.status(500).send({ message: err.message });
      }
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
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки или пользователя.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
