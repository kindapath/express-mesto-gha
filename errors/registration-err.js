class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistrationError';
    this.statusCode = 401;
  }
}

module.exports = RegistrationError;
