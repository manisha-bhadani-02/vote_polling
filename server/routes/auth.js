const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'CHANGE_ME';

// Helper: create token + safe user payload
function generateAuthResponse(user) {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { token, user: payload };
}

// ✅ Register normal user (now returns token + user)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email, password required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({ name, email, passwordHash, role: 'user' });
    await user.save();

    const authData = generateAuthResponse(user);
    res.status(201).json({ message: 'User registered', ...authData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Register admin (returns token + user)
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret)
      return res.status(400).json({ message: 'name,email,password,adminSecret required' });

    if (adminSecret !== ADMIN_SECRET)
      return res.status(403).json({ message: 'Invalid admin secret' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({ name, email, passwordHash, role: 'admin' });
    await user.save();

    const authData = generateAuthResponse(user);
    res.status(201).json({ message: 'Admin user created', ...authData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login (already perfect)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
