const authClient = require('../authClient');

// Checks the Authorization: Bearer <token> header, verifies it with
// Supabase, and attaches the verified user to req.user
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = data.user;
  next();
}

module.exports = requireAuth;