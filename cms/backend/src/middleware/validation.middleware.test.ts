
import { Request, Response, NextFunction } from 'express';
import { validateProjectUpdate } from './validation.middleware';
import { AppError } from './error.middleware';

describe('validateProjectUpdate Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should pass validation for an empty body', () => {
    validateProjectUpdate(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should fail validation if title is too long', () => {
    mockRequest.body = {
      title: 'a'.repeat(201),
    };
    validateProjectUpdate(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should fail validation for invalid slug', () => {
    mockRequest.body = {
      slug: 'invalid slug with spaces',
    };
    validateProjectUpdate(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should pass validation for valid data', () => {
    mockRequest.body = {
      title: 'Valid Title',
      slug: 'valid-slug',
      description: 'This is a valid description.',
    };
    validateProjectUpdate(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next with an AppError when validation fails', () => {
    mockRequest.body = {
      link: 'not-a-valid-url',
    };
    validateProjectUpdate(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    const error = (nextFunction as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toHaveProperty('link');
  });
});
