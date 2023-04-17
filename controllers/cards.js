const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен

  const {
    _id,
  } = req.user;

  const {
    name, link,
  } = req.body;

  Card.create({ owner: _id, name, link })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const {
    cardId,
  } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
