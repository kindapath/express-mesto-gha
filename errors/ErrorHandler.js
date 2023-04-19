const { default: mongoose } = require('mongoose');
const ValidationError = require('./ValidationError');
const CastError = require('./CastError');

function sendError({
  err, validationMessage, castMessage, res,
}) {
  const ERROR_CODE = 400;
  const NOTFOUND_CODE = 404;
  const DEFAULT_CODE = 500;

  if (err.name === 'ValidationError') {
    return res.status(ERROR_CODE).send(
      { message: validationMessage },
    );
  }

  if (err.name === 'CastError') {
    return res.status(NOTFOUND_CODE).send(
      { message: castMessage },
    );
  }

  sendError(res);
  return res.status(DEFAULT_CODE).send({ message: err.message });
}

function isValidObjectId({ id, res, message }) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send({ message });
    throw new ValidationError();
  }
}

function checkIfNull(obj) {
  if (obj === null) {
    throw new CastError();
  }
}

module.exports = {
  sendError,
  isValidObjectId,
  checkIfNull,
};
