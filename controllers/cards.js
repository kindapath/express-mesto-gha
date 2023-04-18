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
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
};
