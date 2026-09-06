// Simple test script - avoids PowerShell's curl quoting issues entirely
const BASE_URL = 'http://localhost:4000';

async function main() {
  // 1. Sign up
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'khushi.hackathon.test@gmail.com', password: 'test1234' }),
  });
  console.log('Signup status:', signupRes.status);
  console.log('Signup body:', await signupRes.json());

  // 2. Log in
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'khushi.hackathon.test@gmail.com', password: 'test1234' }),
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status);
  console.log('Login body:', loginData);

  const token = loginData.access_token;
  if (!token) {
    console.log('No token received - stopping here.');
    return;
  }

  // 3. Add a stock to watchlist
  const addRes = await fetch(`${BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ symbol: 'TCS.NS' }),
  });
  console.log('Add stock status:', addRes.status);
  console.log('Add stock body:', await addRes.json());

  // 4. Fetch watchlist
  const listRes = await fetch(`${BASE_URL}/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('List status:', listRes.status);
  console.log('List body:', await listRes.json());

  // 5. Fetch digest
  const digestRes = await fetch(`${BASE_URL}/watchlist/digest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Digest status:', digestRes.status);
  console.log('Digest body:', await digestRes.json());
}

main().catch(console.error);