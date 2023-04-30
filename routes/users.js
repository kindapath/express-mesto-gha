const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  editProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), editProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;
