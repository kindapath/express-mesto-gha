const { celebrate, Joi } = require('celebrate');
const { regex } = require('../constatant/constants');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
});

const validateEditProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateEditProfile,
  validateAvatar,
  validateCreateCard,
  validateCardId,
};
