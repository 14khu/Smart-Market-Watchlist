const express = require('express');
const authClient = require('../authClient');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await authClient.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ access_token: data.session.access_token, user: data.user });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;