const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// verify the token and attach user to req.user
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = (authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing authorization token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionally fetch fresh user from DB
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // contains role
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// middleware factory to require specific roles
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    next();
  };
}

module.exports = { requireAuth, requireRole };
