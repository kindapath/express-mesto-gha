module.exports = class CastError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'CastError';
  }
};
