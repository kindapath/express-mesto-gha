const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/authentication-err');

const handleAuthError = () => {
  throw new AuthenticationError('Необходимо авторизироваться.');
};

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!jwt) {
    return handleAuthError();
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  return next();
};
