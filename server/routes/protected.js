const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Any authenticated user (user or admin)
router.get('/user/profile', requireAuth, (req, res) => {
  // req.user comes from middleware
  res.json({ profile: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

// Admin-only route
router.get('/admin/dashboard', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: `Welcome to admin dashboard, ${req.user.name}` });
});

// Example: route accessible to both user and admin but demonstrates role check inside handler
router.get('/shared/info', requireAuth, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ info: 'Admin-level information' });
  } else {
    return res.json({ info: 'User-level information' });
  }
});

module.exports = router;
