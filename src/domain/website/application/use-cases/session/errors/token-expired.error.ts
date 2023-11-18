class TokenExpiredError extends Error {
  constructor() {
    super('Expired token');
  }
}

export default TokenExpiredError;
