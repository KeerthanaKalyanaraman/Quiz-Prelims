const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: No Authorization header provided.'
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Token missing.'
      });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_terminal_jwt_key_mca_2026';
    const decoded = jwt.verify(token, secret);

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session Expired: Token has expired (8h limit). Please log in again.'
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Access Forbidden: Invalid token.'
    });
  }
};

module.exports = adminAuth;
