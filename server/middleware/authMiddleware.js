const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: Validates Bearer JWT token from Authorization header,
 * decodes userId, fetches user record, and attaches to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'campus_connect_jwt_secret_key_2026_super_secure'
      );

      // Find user and attach to req.user (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid, malformed, or expired authorization token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized! No Bearer token provided in request header',
    });
  }
};

module.exports = { protect };
