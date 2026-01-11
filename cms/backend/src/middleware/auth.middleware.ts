import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Extend Express Request to include user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authentication token is required',
        },
      });
      return;
    }

    // Verify token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        // Handle different JWT errors
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Authentication token has expired',
            },
          });
          return;
        }

        if (err.name === 'JsonWebTokenError') {
          res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid authentication token',
            },
          });
          return;
        }

        // Generic token error
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_ERROR',
            message: 'Token verification failed',
          },
        });
        return;
      }

      // Attach user info to request
      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during authentication',
      },
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      next();
      return;
    }

    // Verify token if present
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded as JwtPayload;
      }
      next();
    });
  } catch (error) {
    next();
  }
};
