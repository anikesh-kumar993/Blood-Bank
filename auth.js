/**
 * Authentication Logic - Login & Registration
 * Uses localStorage only (no backend required)
 */

// ===== Password Toggle =====
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash text-muted';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye text-muted';
  }
}

// ===== Role Selection for Registration =====
function selectRole(role) {
  document.getElementById('registerRole').value = role;

  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.remove('active', 'btn-danger');
    btn.classList.add('btn-outline-danger');
  });
  const activeBtn = document.querySelector(`[data-role="${role}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'btn-danger');
    activeBtn.classList.remove('btn-outline-danger');
  }

  const donorFields = document.getElementById('donorFields');
  const hospitalFields = document.getElementById('hospitalFields');
  if (donorFields) donorFields.style.display = role === 'donor' ? 'block' : 'none';
  if (hospitalFields) hospitalFields.style.display = role === 'hospital' ? 'block' : 'none';
}

// ===== GPS Location Detection =====
function getLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser', 'error');
    return;
  }
  showToast('Detecting your location...', 'info');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById('regLat').value = position.coords.latitude;
      document.getElementById('regLng').value = position.coords.longitude;
      document.getElementById('locationStatus').style.display = 'block';
      document.getElementById('locationText').textContent =
        `Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
      showToast('Location detected successfully!', 'success');
    },
    () => {
      showToast('Unable to detect location. Please allow location access.', 'error');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// ===== Local User Database Helpers =====
function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem('dbn_users') || '[]');
  } catch {
    return [];
  }
}

function saveAllUsers(users) {
  localStorage.setItem('dbn_users', JSON.stringify(users));
}

function findUserByEmail(email) {
  return getAllUsers().find(u => u.email === email.toLowerCase().trim());
}

function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== Redirect by Role =====
function redirectByRole(role) {
  const routes = {
    donor: './donor-dashboard.html',
    patient: './patient-dashboard.html',
    hospital: './hospital-dashboard.html',
    admin: './admin-dashboard.html'
  };
  window.location.href = routes[role] || './index.html';
}

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {

  // ---- Login Form ----
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Logging in...';
      btn.disabled = true;

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      // Small delay for UX
      await new Promise(r => setTimeout(r, 600));

      const user = findUserByEmail(email);

      if (!user) {
        showToast('No account found with this email. Please register first.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      if (user.password !== password) {
        showToast('Incorrect password. Please try again.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      // Store session (exclude password)
      const { password: _p, ...safeUser } = user;
      const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
      Auth.setAuth(fakeToken, safeUser);

      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => redirectByRole(user.role), 1000);
    });
  }

  // ---- Register Form ----
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('registerBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Creating account...';
      btn.disabled = true;

      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const role = document.getElementById('registerRole').value || 'donor';

      // Small delay for UX
      await new Promise(r => setTimeout(r, 600));

      if (findUserByEmail(email)) {
        showToast('An account with this email already exists. Please login.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      if (!name || !email || !password || !phone) {
        showToast('Please fill in all required fields.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }

      // Build user object
      const newUser = {
        id: generateId(),
        name,
        email,
        phone,
        password,    // In real app, never store plaintext. OK for local-only demo.
        role,
        createdAt: new Date().toISOString()
      };

      // Role-specific fields
      if (role === 'donor') {
        newUser.bloodGroup = document.getElementById('regBloodGroup')?.value || '';
        newUser.age = parseInt(document.getElementById('regAge')?.value) || null;
        newUser.gender = document.getElementById('regGender')?.value || '';
        newUser.address = document.getElementById('regAddress')?.value || '';
        const lat = parseFloat(document.getElementById('regLat')?.value);
        const lng = parseFloat(document.getElementById('regLng')?.value);
        if (lat && lng && lat !== 0 && lng !== 0) {
          newUser.location = { lat, lng };
        }
      } else if (role === 'hospital') {
        newUser.hospitalName = document.getElementById('regHospitalName')?.value || '';
        newUser.hospitalAddress = document.getElementById('regHospitalAddress')?.value || '';
      }

      // Save to localStorage
      const allUsers = getAllUsers();
      allUsers.push(newUser);
      saveAllUsers(allUsers);

      // Set session
      const { password: _p, ...safeUser } = newUser;
      const fakeToken = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
      Auth.setAuth(fakeToken, safeUser);

      showToast('Registration successful! Welcome to BloodNet!', 'success');
      setTimeout(() => redirectByRole(role), 1000);
    });
  }
});
