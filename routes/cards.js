const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.delete('/:cardId', deleteCard);

router.post('/', createCard);

module.exports = router;
