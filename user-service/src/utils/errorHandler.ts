import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

// Các loại lỗi cụ thể

class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message: string = 'Validation error') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401);
    }
}

class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500, false);
    }
}

class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
    }
}

class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

// ErrorHandler tập trung

class ErrorHandler {
    public static handleError(err: Error, res: Response): void {
        if (this.isTrustedError(err)) {
            const appError = err as AppError;
            res.status(appError.statusCode).json({
                status: 'error',
                message: appError.message,
            });
        } else {
            console.error(`Unexpected error: ${err.message}`);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
            });
        }
    }

    private static isTrustedError(error: Error): boolean {
        return error instanceof AppError && error.isOperational;
    }
}

export { AppError, NotFoundError, ValidationError, UnauthorizedError, InternalServerError, BadRequestError, ForbiddenError, ErrorHandler };
