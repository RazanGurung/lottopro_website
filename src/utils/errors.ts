/**
 * Custom Error Classes
 */

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed. Please login again.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ServerError extends Error {
  constructor(message: string = 'Server error occurred. Please try again later.') {
    super(message);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Invalid request data.') {
    super(message);
    this.name = 'ValidationError';
  }
}
