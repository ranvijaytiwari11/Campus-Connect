/**
 * Role-Based Access Control (RBAC) Middleware.
 * Higher-order middleware function checking if the authenticated user's role
 * is authorized for the endpoint.
 *
 * @param  {...string} roles - Array of allowed roles (e.g. 'admin', 'teacher')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to perform this action`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
