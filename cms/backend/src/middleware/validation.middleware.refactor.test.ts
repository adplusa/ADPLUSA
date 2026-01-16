
import { Request, Response, NextFunction } from 'express';
import { validate } from './validation.middleware';
import { ValidationSchema } from './validation.schemas';
import { AppError } from './error.middleware';

describe('Validation Middleware (Refactored)', () => {
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

    const testSchema: ValidationSchema = {
        name: { required: true, type: 'string' },
        age: { required: false, type: 'number' },
    };

    it('should pass validation for a valid body', () => {
        mockRequest.body = { name: 'John Doe', age: 30 };
        const middleware = validate(testSchema);
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should fail validation for a missing required field', () => {
        mockRequest.body = { age: 30 };
        const middleware = validate(testSchema);
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should fail validation for an incorrect type', () => {
        mockRequest.body = { name: 'John Doe', age: '30' };
        const middleware = validate(testSchema);
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should pass validation for an empty body if no fields are required', () => {
        const noRequiredFieldsSchema: ValidationSchema = {
            name: { required: false, type: 'string' },
            age: { required: false, type: 'number' },
        };
        const middleware = validate(noRequiredFieldsSchema);
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith();
    });
});
