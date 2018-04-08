class APIError extends Error {
  constructor(msg, status) {
    super(msg);
    this.status = status;
  }
}

export { APIError };
