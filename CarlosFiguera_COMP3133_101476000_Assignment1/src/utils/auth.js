const jwt = require('jsonwebtoken');
const { unauthorized } = require('./errors');
const User = require('../models/User');

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  if (!secret) throw new Error('Missing JWT_SECRET');
  return jwt.sign({ sub: user._id.toString(), username: user.username, email: user.email }, secret, { expiresIn });
}

async function getUserFromRequest(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select('_id username email');
    return user || null;
  } catch {
    return null;
  }
}

function requireAuth(ctx) {
  if (!ctx.user) throw unauthorized('Missing or invalid token');
  return ctx.user;
}

module.exports = { signToken, getUserFromRequest, requireAuth };
