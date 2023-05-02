const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getAllUsers,
  getUserById,
  editProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { regex } = require('../constatant/constants');

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
}), editProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
}), updateAvatar);

module.exports = router;
