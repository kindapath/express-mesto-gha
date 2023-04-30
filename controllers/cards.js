const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
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
      throw new NotFoundError('Карточка не найдена или вы не можете ее удалить.');
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
      throw new NotFoundError('Карточка не найдена.');
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
      throw new NotFoundError('Карточка не найдена.');
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
