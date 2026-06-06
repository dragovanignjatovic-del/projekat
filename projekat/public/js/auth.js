// Token helpers
function saveToken(token) { localStorage.setItem('fmq_token', token); }
function getToken() { return localStorage.getItem('fmq_token'); }
function removeToken() { localStorage.removeItem('fmq_token'); localStorage.removeItem('fmq_user'); }
function saveUser(user) { localStorage.setItem('fmq_user', JSON.stringify(user)); }
function getUser() { try { return JSON.parse(localStorage.getItem('fmq_user')); } catch(e) { return null; } }
function isLoggedIn() { return !!getToken(); }

// Update nav based on auth state
function updateNav() {
  const token = getToken();
  const user = getUser();
  const loginBtn = document.getElementById('nav-login');
  const regBtn = document.getElementById('nav-register');
  const userMenu = document.getElementById('nav-user');
  const userName = document.getElementById('nav-username');
  const oglasBtn = document.getElementById('nav-oglas');

  if (token && user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (regBtn) regBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = user.korisnicko_ime || user.ime || user.email;
    if (oglasBtn) oglasBtn.style.display = user.tip === 'oglasivac' ? 'inline-flex' : 'none';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (regBtn) regBtn.style.display = 'inline-flex';
    if (userMenu) userMenu.style.display = 'none';
    if (oglasBtn) oglasBtn.style.display = 'none';
  }
}

// Logout
function logout() {
  removeToken();
  window.location.href = '/';
}

// Login form handler
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const lozinka = document.getElementById('login-lozinka').value;
  const errEl = document.getElementById('login-error');
  if (errEl) errEl.textContent = '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lozinka })
    });
    const data = await res.json();
    if (!res.ok) { if (errEl) errEl.textContent = data.error; return; }
    saveToken(data.token);
    saveUser(data.user);
    window.location.href = '/';
  } catch (err) {
    if (errEl) errEl.textContent = 'Greska pri povezivanju sa serverom';
  }
}

// Register form handler
async function handleRegister(e, tip) {
  e.preventDefault();
  const form = e.target;
  const errEl = document.getElementById('reg-error-' + tip);
  if (errEl) errEl.textContent = '';

  const data = { tip };
  form.querySelectorAll('input, select').forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) { if (errEl) errEl.textContent = result.error; return; }
    saveToken(result.token);
    saveUser(result.user);
    window.location.href = '/';
  } catch (err) {
    if (errEl) errEl.textContent = 'Greska pri povezivanju sa serverom';
  }
}

// Fetch current user info
async function fetchMe() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) { removeToken(); return null; }
    const user = await res.json();
    saveUser(user);
    return user;
  } catch(e) { return null; }
}

// Require auth (redirect if not logged in)
function requireAuth() {
  if (!isLoggedIn()) { window.location.href = '/registracija.html'; return false; }
  return true;
}

// Require oglasivac role
function requireOglasivac() {
  const user = getUser();
  if (!user || user.tip !== 'oglasivac') {
    alert('Ova stranica je dostupna samo oglasivacima.');
    window.location.href = '/';
    return false;
  }
  return true;
}
