const jwt = require('jsonwebtoken');

/**
 * Generate cryptographically signed JWT Token
 * @param {string} id - MongoDB ObjectId as string
 * @param {string} role - User role ('admin' | 'teacher' | 'student')
 * @returns {string} Signed JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'campus_connect_jwt_secret_key_2026_super_secure',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
