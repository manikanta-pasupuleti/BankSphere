import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authorization.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden'
    });
  }

  next();
};

export const requireSelfOrAdmin = (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.userId === req.params.id) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden'
  });
};
