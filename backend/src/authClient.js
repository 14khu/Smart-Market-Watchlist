require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Separate client using the anon key - used only for auth operations
// (signup/login). Your existing db.js with the service key stays as-is
// for actual data reads/writes.
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = authClient;