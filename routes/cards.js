const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validateCreateCard, validateCardId } = require('../middlewares/validations');

router.get('/', getAllCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
